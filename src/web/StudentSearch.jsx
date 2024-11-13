import React, { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Formik, Form, Field } from 'formik'
import { supabase } from '../services/supabaseClient'

const StudentSearch = () => {
  const [students, setStudents] = useState([])
  const [filteredStudents, setFilteredStudents] = useState([])

  // Supabase'den tüm öğrencileri çek
  const fetchStudents = async () => {
    const { data, error } = await supabase
      .from('students') // 'students' tablo adını kendi veritabanınıza göre değiştirin
      .select('*')

    if (error) {
      console.error('Öğrenciler alınamadı:', error)
    } else {
      setStudents(data)
      setFilteredStudents(data)
    }
  }

  // Sayfa yüklendiğinde öğrencileri çek
  useEffect(() => {
    fetchStudents()
  }, [])

  // Formik ile arama fonksiyonu
  const handleSearch = async (values) => {
    const searchQuery = values.search.toLowerCase()

    // Supabase'den filtrelenmiş sonuçları çek
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .ilike('name', `%${searchQuery}%`) // Öğrenci adını küçük/büyük harfe duyarsız arar

    if (error) {
      console.error('Arama sırasında hata oluştu:', error)
    } else {
      setFilteredStudents(data)
    }
  }

  return (
    <div>
      <h2>Öğrenci Arama</h2>
      <Formik initialValues={{ search: ''}} onSubmit={handleSearch}>
        {() => (
          <Form className="flex items-center gap-2 mb-4">
            <Field
              name="search"
              type="text"
              placeholder="Öğrenci ismini giriniz"
              className="border border-gray-300 p-2 rounded-lg w-60"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
              Ara
            </button>
          </Form>
        )}
      </Formik>

      <div className="grid grid-cols-3 gap-4">
        {filteredStudents.map((student) => (
          <div
            className="border border-gray-200 rounded-lg p-4 shadow-lg"
            key={student.id}
          >
            <h3 className="font-semibold text-lg">
              {student.name} - {student.class}
            </h3>
          </div>
        ))}
      </div>
    </div>
  )
}

export default StudentSearch
