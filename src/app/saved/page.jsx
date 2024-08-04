'use client'
import { useState, useEffect } from 'react'
import CountryCard from '@/components/CountryCard'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function SavedPage() {
  const [savedCountries, setSavedCountries] = useState([])

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('savedCountries') || '[]')
    setSavedCountries(saved)
  }, [])

  const handleDelete = (cca3) => {
    const updatedCountries = savedCountries.filter(country => country.cca3 !== cca3)
    setSavedCountries(updatedCountries)
    localStorage.setItem('savedCountries', JSON.stringify(updatedCountries))
  }

  return (
    <div>
      <Header />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Saved Countries</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {savedCountries.map((country) => (
            <CountryCard key={country.cca3} country={country} isSaved={true} onDelete={handleDelete} />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  )
}
