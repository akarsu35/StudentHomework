import React, { useEffect, useState } from 'react'
import { supabase } from '../services/supabaseClient'

import { Formik, Form, Field } from 'formik'



const StudentList = () => {
  const [students, setStudents] = useState([])
  const [studentHomework, setStudentHomework] = useState({}) // Öğrenci ödevleri için obje
  const [isOpen, setIsOpen] = useState({}) // Her öğrenci için ayrı isOpen durumu
  const [filteredStudents, setFilteredStudents] = useState([])
  const [searchIsOpen, setSearchIsOpen] = useState(false)
  const [show, setShow] = useState(false)
  const [activeButton, setActiveButton] = useState(null) // Aktif butonu takip eden state
  const [homeworks, setHomeworks] = useState([])
  useEffect(() => {
    fetchStudents()
    fetchHomeworkList()
  
   
  }, [])


  const fetchStudents = async () => {
    const { data, error } = await supabase.from('students').select('*')
    if (error) {
      console.log('Error fetching students data:', error)
    } else {
      setStudents(data)

      data.forEach((student) => fetchStudentHomeworkForStudent(student.id))
    }
  }
 const fetchHomeworkList = async () => {
   const { data, error } = await supabase.from('homeworks').select('*')
   if (error) {
     console.log('Error fetching homeworks data:', error)
   } else {
     setHomeworks(data) // Tüm veriyi doğrudan set et
     console.log('Fetched homeworks:', data)
   }
 }


  const fetchStudentHomeworkForStudent = async (studentId) => {
    const { data, error } = await supabase
      .from('student_homework')
      .select('homework_id,name,homework_status')

      .eq('student_id', studentId)

    if (error) {
      console.error('Error fetching homework for student:', error)
    } else {
      setStudentHomework((prevHomework) => ({
        ...prevHomework,
        [studentId]: data,
      }))

      console.log('studenthomework:', data)
      console.log('a: ', studentHomework)
    }
  }

  const updateHomeworkStatus = async (homeworkId, studentId, newStatus) => {
    const { error } = await supabase
      .from('student_homework')
      .update({ homework_status: newStatus })
      .eq('student_id', studentId)
      .eq('homework_id', homeworkId)
    console.log(
      'student: ',
      studentId,
      'homework: ',
      homeworkId,
      'new status: ',
      newStatus
    )

    if (error) {
      console.error('Error updating status:', error)
    } else {
      alert('Homework status updated successfully')
      fetchStudentHomeworkForStudent(studentId)
     
    }
  }

  const handleStatusChange = (homeworkId, studentId, statusType) => {
    const updatedStatus = {
      yapildi: statusType === 'yapildi',
      yapilmadi: statusType === 'yapilmadi',
      eksik: statusType === 'eksik',
      gelmedi: statusType === 'gelmedi',
    }
    updateHomeworkStatus(homeworkId, studentId, updatedStatus)
  }

  const toggleStudent = (studentId) => {
    setIsOpen((prevIsOpen) => ({
      ...prevIsOpen,
      [studentId]: !prevIsOpen[studentId], // Öğrencinin mevcut durumunu tersine çevir
    }))
    setActiveButton(studentId) // Tıklanan butonu aktif olarak ayarla
  }
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
      setSearchIsOpen(true)
    }
  }

  return (
    <div>
      <h1 className="flex bg-blue-500 justify-center items-center rounded-md w-full mt-8 mb-3 h-8 text-xl text-white font-semibold">
        Öğrenciler
      </h1>
      <div>
        <h2>Öğrenci Arama</h2>
        <Formik initialValues={{ search: '' }} onSubmit={handleSearch}>
          {() => (
            <Form className="flex flex-wrap items-center gap-2 mb-4">
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
              <button
                type="button"
                className="px-4 py-2 bg-green-600 text-white rounded-lg"
                onClick={() => setSearchIsOpen(false)}
              >
                Sıfırla
              </button>
            </Form>
          )}
        </Formik>
        {/* <button
          className="px-4 py-2 bg-green-600 text-white rounded-lg"
          onClick={() => setShow(!show)}
        >
          Tüm Öğrencileri Göster
        </button> */}
      </div>

      {searchIsOpen ? (
        <div className="flex flex-col">
          {filteredStudents.map((student) => (
            <li
              className="flex flex-col justify-center items-center"
              key={student.id}
            >
              <button
                onClick={() => toggleStudent(student.id)}
                id={student.id}
                className="text-xl font-semibold border border-gray-200 rounded-lg p-4 shadow-lg w-full my-2 flex justify-center items-center "
              >
                {student.name} - {student.class}
              </button>
              {isOpen[student.id] ? (
                <div>
                  <ul className="flex flex-wrap gap-2">
                    {(studentHomework[student.id] || []).map((homework) => (
                      <li
                        className="flex flex-col justify-center items-center border border-yellow-600 rounded-md w-96"
                        key={homework.homework_id}
                      >
                        <h3>Ödev Adı: {homework.name}</h3>
                        <div>
                          <button
                            onClick={() =>
                              handleStatusChange(
                                homework.homework_id,
                                student.id,
                                'yapildi'
                              )
                            }
                            className={`mr-2 px-2 py-1 rounded ${
                              homework.homework_status?.yapildi
                                ? 'bg-green-500'
                                : 'bg-gray-300'
                            }`}
                          >
                            Yapıldı
                          </button>
                          <button
                            onClick={() =>
                              handleStatusChange(
                                homework.homework_id,
                                student.id,
                                'yapilmadi'
                              )
                            }
                            className={`mr-2 px-2 py-1 rounded ${
                              homework.homework_status?.yapilmadi
                                ? 'bg-red-500'
                                : 'bg-gray-300'
                            }`}
                          >
                            Yapılmadı
                          </button>
                          <button
                            onClick={() =>
                              handleStatusChange(
                                homework.homework_id,
                                student.id,
                                'eksik'
                              )
                            }
                            className={`mr-2 px-2 py-1 rounded ${
                              homework.homework_status?.eksik
                                ? 'bg-yellow-500'
                                : 'bg-gray-300'
                            }`}
                          >
                            Eksik
                          </button>
                          <button
                            onClick={() =>
                              handleStatusChange(
                                homework.homework_id,
                                student.id,
                                'gelmedi'
                              )
                            }
                            className={`px-2 py-1 rounded ${
                              homework.homework_status?.gelmedi
                                ? 'bg-blue-500'
                                : 'bg-gray-300'
                            }`}
                          >
                            Gelmedi
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </li>
          ))}
        </div>
      ) : (
        <ul className="flex flex-wrap gap-2">
          {students.map((student) => (
            <li key={student.id}>
              <button
                onClick={() => toggleStudent(student.id)}
                id={student.id}
                className={`text-xl font-semibold border border-gray-200 rounded-lg p-1 shadow-lg w-80 my-1 flex justify-center items-center 
              ${activeButton === student.id ? 'bg-yellow-500 text-white' : ''}`}
              >
                {student.name} - {student.class}
              </button>
              {isOpen[student.id] ? (
                <ul className="flex flex-col gap-2">
                  {(studentHomework[student.id] || []).map((homework) => (
                    <li
                      className="flex flex-col justify-center items-center border border-yellow-600 rounded-md w-full py-1"
                      key={homework.homework_id}
                    >
                      <h3 className="text-lg font-medium">
                        Ödev Adı:{homework.name}
                        {console.log(homework.name)}
                      </h3>
                      <div>
                        <button
                          onClick={() =>
                            handleStatusChange(
                              homework.homework_id,
                              student.id,
                              'yapildi'
                            )
                          }
                          className={`m-2 px-2 py-1 rounded ${
                            homework.homework_status?.yapildi
                              ? 'bg-green-500'
                              : 'bg-gray-300'
                          }`}
                        >
                          Yapıldı
                        </button>
                        <button
                          onClick={() =>
                            handleStatusChange(
                              homework.homework_id,
                              student.id,
                              'yapilmadi'
                            )
                          }
                          className={`mr-2 px-2 py-1 rounded ${
                            homework.homework_status?.yapilmadi
                              ? 'bg-red-500'
                              : 'bg-gray-300'
                          }`}
                        >
                          Yapılmadı
                        </button>
                        <button
                          onClick={() =>
                            handleStatusChange(
                              homework.homework_id,
                              student.id,
                              'eksik'
                            )
                          }
                          className={`mr-2 px-2 py-1 rounded ${
                            homework.homework_status?.eksik
                              ? 'bg-yellow-500'
                              : 'bg-gray-300'
                          }`}
                        >
                          Eksik
                        </button>
                        <button
                          onClick={() =>
                            handleStatusChange(
                              homework.homework_id,
                              student.id,
                              'gelmedi'
                            )
                          }
                          className={`px-2 py-1 rounded ${
                            homework.homework_status?.gelmedi
                              ? 'bg-blue-500'
                              : 'bg-gray-300'
                          }`}
                        >
                          Gelmedi
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default StudentList
