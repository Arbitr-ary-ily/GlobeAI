'use client'
import { useState, useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Header from "@/components/Header"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { Map, Users, Book, Mountain, Church, DollarSign, Globe, Edit, Trash } from 'lucide-react'
import 'ol/ol.css'
import { Map as OlMap, View } from 'ol'
import TileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'
import { fromLonLat } from 'ol/proj'
import { marked } from 'marked'
import Footer from '@/components/Footer'

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

export default function CountryPage() {
  const { id } = useParams()
  const [country, setCountry] = useState(null)
  const [religions, setReligions] = useState([])
  const [ethnicities, setEthnicities] = useState([])
  const [currency, setCurrency] = useState('')
  const [subregion, setSubregion] = useState('')
  const [summary, setSummary] = useState('')
  const [question, setQuestion] = useState('')
  const [conversations, setConversations] = useState([])
  const [loading, setLoading] = useState(false)
  const [editIndex, setEditIndex] = useState(null)
  const mapRef = useRef(null)

  useEffect(() => {
    const fetchCountry = async () => {
      const response = await fetch(`https://restcountries.com/v3.1/alpha/${id}`)
      const data = await response.json()
      setCountry(data[0])
      fetchGeminiData(data[0])
    }
    fetchCountry()
  }, [id])

  useEffect(() => {
    if (country && mapRef.current) {
      const map = new OlMap({
        target: mapRef.current,
        layers: [
          new TileLayer({
            source: new OSM()
          })
        ],
        view: new View({
          center: fromLonLat([country.latlng[1], country.latlng[0]]),
          zoom: 5
        })
      })

      return () => map.setTarget(undefined)
    }
  }, [country])

  const fetchGeminiData = async (country) => {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro"});
      
      // Fetch top 3 religions
      let prompt = `List the top 3 major religions in ${country.name.common}.`;
      let result = await model.generateContent(prompt);
      setReligions(result.response.text().split('\n'));

      // Fetch top 3 ethnicities
      prompt = `List the top 3 major ethnicities in ${country.name.common}.`;
      result = await model.generateContent(prompt);
      setEthnicities(result.response.text().split('\n'));

      // Fetch currency
      const currencies = Object.values(country.currencies || {}).map(c => c.name).join(', ');
      setCurrency(currencies || 'Currency isn\'t available');

      // Fetch subregion
      setSubregion(country.subregion || 'Subregion isn\'t available');

      // Fetch summary
      prompt = `Give a brief summary of ${country.name.common} in 3-4 sentences.`;
      result = await model.generateContent(prompt);
      setSummary(marked(result.response.text()));

    } catch (error) {
      console.error('Error querying Gemini AI:', error);
    }
  }

  const askQuestion = async () => {
    setLoading(true)
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro"});
      const prompt = `Answer this question about ${country.name.common}: ${question}`;
      const result = await model.generateContent(prompt);
      const newConversation = {
        id: Date.now(),
        question,
        answer: marked(result.response.text())
      }
      setConversations([...conversations, newConversation]);
      setQuestion('');
    } catch (error) {
      console.error('Error querying Gemini AI:', error);
    } finally {
      setLoading(false)
    }
  }

  const editQuestion = (index) => {
    const selectedConversation = conversations[index];
    setQuestion(selectedConversation.question);
    setEditIndex(index);
  }

  const updateQuestion = async () => {
    setLoading(true);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro"});
      const prompt = `Answer this question about ${country.name.common}: ${question}`;
      const result = await model.generateContent(prompt);
      const updatedConversations = conversations.map((conversation, index) => {
        if (index === editIndex) {
          return {
            ...conversation,
            question,
            answer: marked(result.response.text())
          };
        }
        return conversation;
      });
      setConversations(updatedConversations);
      setQuestion('');
      setEditIndex(null);
    } catch (error) {
      console.error('Error querying Gemini AI:', error);
    } finally {
      setLoading(false);
    }
  }

  const deleteConversation = (index) => {
    const updatedConversations = conversations.filter((_, i) => i !== index);
    setConversations(updatedConversations);
  }

  const renderList = (items) => {
    return (
      <ol className="list-inside">
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ol>
    );
  }

  return (
    <div>
    <div>
      <Header />
    </div>
    <div className="container mx-auto p-4">
      {country ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="text-lg font-semibold">{country.name.common}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="aspect-w-16 aspect-h-9">
                <img 
                  src={country.flags.svg} 
                  alt={`${country.name.common} flag`} 
                  className="object-cover w-full h-full rounded-md"
                />
              </div>
              <div>
                <div className="flex items-center mb-2">
                  <Map className="w-4 h-4 mr-2" />
                  <span>Capital: {country.capital?.[0] || 'Capital isn\'t available'}</span>
                </div>
                <div className="flex items-center mb-2">
                  <Users className="w-4 h-4 mr-2" />
                  <span>Population: {country.population.toLocaleString()}</span>
                </div>
                <div className="flex items-center mb-2">
                  <Mountain className="w-4 h-4 mr-2" />
                  <span>Region: {country.region}</span>
                </div>
                <div className="flex items-center mb-2">
                  <Globe className="w-4 h-4 mr-2" />
                  <span>Subregion: {subregion}</span>
                </div>
                <div className="flex items-center mb-2">
                  <Church className="w-4 h-4 mr-2" />
                  <span>Languages: {Object.values(country.languages || {}).join(', ') || 'Languages aren\'t available'}</span>
                </div>
                <div className="flex items-center mb-2">
                  <DollarSign className="w-4 h-4 mr-2" />
                  <span>Currency: {currency}</span>
                </div>
                <div className="flex items-center mb-2">
                  <Book className="w-4 h-4 mr-2" />
                  <span>Major Religions:</span>
                </div>
                {renderList(religions)}
                <div className="flex items-center mb-2">
                  <Users className="w-4 h-4 mr-2" />
                  <span>Major Ethnicities:</span>
                </div>
                {renderList(ethnicities)}
              </div>
            </div>
            <div className="mt-4">
              <h2 className="text-xl font-semibold mb-2">Summary</h2>
              <div dangerouslySetInnerHTML={{ __html: summary }} />
            </div>
            <div className="mt-4">
              <h2 className="text-xl font-semibold mb-2">Ask a Question</h2>
              <Input 
                placeholder="Ask a question about this country..." 
                value={question} 
                onChange={(e) => setQuestion(e.target.value)} 
                className="mb-2"
              />
              <Button onClick={editIndex !== null ? updateQuestion : askQuestion} disabled={loading}>
                {editIndex !== null ? 'Update Question' : 'Ask Question'}
              </Button>
              {conversations.length > 0 && (
                <div className="mt-4">
                  {conversations.map((conversation, index) => (
                    <Card key={conversation.id} className="mb-4">
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span className="text-lg font-semibold">Question</span>
                          <Button variant="ghost" onClick={() => deleteConversation(index)}>
                            <Trash className="w-4 h-4" />
                          </Button>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p><strong>Question:</strong> {conversation.question}</p>
                        <p><strong>Answer:</strong></p>
                        <div dangerouslySetInnerHTML={{ __html: conversation.answer }} />
                        <Button className="mt-2" onClick={() => editQuestion(index)}>Edit</Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <p>Loading country data...</p>
      )}
      <div ref={mapRef} className="mt-4 h-96" />
    </div>
    <Footer />
    </div>
  )
}
