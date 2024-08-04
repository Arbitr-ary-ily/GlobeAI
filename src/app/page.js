'use client'
import { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import CountryCard from '@/components/CountryCard'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [countries, setCountries] = useState([])
  const [allCountries, setAllCountries] = useState([])
  const [selectedLetter, setSelectedLetter] = useState('')

  useEffect(() => {
    const fetchAllCountries = async () => {
      const response = await fetch('https://restcountries.com/v3.1/all')
      const data = await response.json()
      setAllCountries(data)
      setCountries(data)
    }
    fetchAllCountries()
  }, [])

  const handleSearch = (value) => {
    setSearchTerm(value)
    setSelectedLetter('')
    const filtered = allCountries.filter(country => 
      country.name.common.toLowerCase().includes(value.toLowerCase())
    )
    setCountries(filtered)
  }

  const handleLetterFilter = (letter) => {
    setSelectedLetter(letter)
    setSearchTerm('')
    const filtered = allCountries.filter(country => 
      country.name.common.toLowerCase().startsWith(letter.toLowerCase())
    )
    setCountries(filtered)
  }

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex items-center justify-center">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold mb-4">Find Countries</h1>
          <div className="mb-4">
            <Input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Enter country name"
              className="mb-2"
            />
            <div className="flex flex-wrap gap-2 mb-4">
              {alphabet.map(letter => (
                <Button
                  key={letter}
                  onClick={() => handleLetterFilter(letter)}
                  variant={selectedLetter === letter ? "default" : "outline"}
                  size="sm"
                >
                  {letter}
                </Button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {countries.map((country) => (
              <CountryCard key={country.cca3} country={country} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
