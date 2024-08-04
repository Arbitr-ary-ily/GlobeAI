'use client'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Map, Users, Book, Mountain, Church, Flag, XCircle } from 'lucide-react'
import Footer from '@/components/Footer'

export default function CountryCard({ country, isSaved, onDelete }) {
  const [isCountrySaved, setIsCountrySaved] = useState(isSaved)

  const saveCountry = () => {
    const savedCountries = JSON.parse(localStorage.getItem('savedCountries') || '[]')
    if (!savedCountries.some(c => c.cca3 === country.cca3)) {
      savedCountries.push(country)
      localStorage.setItem('savedCountries', JSON.stringify(savedCountries))
      setIsCountrySaved(true)
    }
  }

  const deleteCountry = () => {
    const savedCountries = JSON.parse(localStorage.getItem('savedCountries') || '[]')
    const updatedCountries = savedCountries.filter(c => c.cca3 !== country.cca3)
    localStorage.setItem('savedCountries', JSON.stringify(updatedCountries))
    setIsCountrySaved(false)
    if (onDelete) onDelete(country.cca3)
  }

  return (
    <Card className="h-full flex flex-col p-4">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="text-lg font-semibold">{country.name.common}</span>
          {isSaved ? (
            <XCircle 
              className="w-6 h-6 cursor-pointer text-red-500" 
              onClick={deleteCountry} 
              title="Click to Delete Country"
            />
          ) : (
            <Flag 
              className={`w-6 h-6 cursor-pointer ${isCountrySaved ? 'text-green-500' : 'text-gray-500'}`} 
              onClick={saveCountry} 
              title={isCountrySaved ? 'Country Saved' : 'Click to Save Country'}
            />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="aspect-w-16 aspect-h-9 mb-4">
          <img 
            src={country.flags.svg} 
            alt={`${country.name.common} flag`} 
            className="object-cover w-full h-full rounded-md"
          />
        </div>
        <div className="grid grid-cols-1 gap-2 text-sm">
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-2" />
            <span>Population: {country.population.toLocaleString()}</span>
          </div>
          <div className="flex items-center">
            <Map className="w-4 h-4 mr-2" />
            <span>Capital: {country.capital?.[0] || 'Capital isn\'t available'}</span>
          </div>
          <div className="flex items-center">
            <Mountain className="w-4 h-4 mr-2" />
            <span>Region: {country.region}</span>
          </div>
          <div className="flex items-center">
            <Church className="w-4 h-4 mr-2" />
            <span>Languages: {Object.values(country.languages || {}).join(', ') || 'Languages aren\'t available'}</span>
          </div>
        </div>
        {!isSaved && (
          <div className="mt-4 flex justify-end">
            <Link href={`/country/${country.cca3}`}>
              <Button variant="outline" size="sm">View Details</Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
