import React, { useEffect, useState } from 'react'
import { supabase } from '../services/supabaseClient'
import { assignHomeworkToAllStudents } from '../services/homeworkServices'
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik'
import * as Yup from 'yup'
import { v4 as uuidv4 } from '../../node_modules/uuid/dist/esm-browser/index'


const HomeworkList = () => {
  const [homeworkList, setHomeworkList] = useState([])
  const [loading, setLoading] = useState(true)
  const [students, setStudents] = useState([])
  useEffect(() => {
    fetchHomeworkList()
    fetchStudents()
    
  }, [])
  const fetchStudents = async () => {
    const { data, error } = await supabase.from('students').select('*')
    if (error) {
      console.log('Error fetching students data:', error)
    } else {
      setStudents(data)
    }
  }
  const fetchHomeworkList = async () => {
    setLoading(true)
    const { data, error } = await supabase.from('homeworks').select('*')
    if (error) {
      console.error('Error fetching homeworks:', error)
    } else {
      setHomeworkList(data)
      console.log(data)
    }
    setLoading(false)
  }

  const handleAddHomework = async (values, { resetForm }) => {
    const homeworkId = uuidv4()
    const { name, selectedStudents } = values

    try {
      // İlk olarak homeworks tablosuna yeni bir ödev ekleyin
      const { error: homeworkError } = await supabase
        .from('homeworks')
        .insert([{ id: homeworkId, name }])

      if (homeworkError) {
        console.error(
          'Error adding homework to homeworks table:',
          homeworkError
        )
        return // Eğer hata varsa, işlemi burada sonlandır
      }

      // Eğer başarıyla eklendiyse student_homework tablosuna ekleyin
      const insertPromises = selectedStudents.map((studentId) => {
        return supabase.from('student_homework').insert([
          {
            student_id: studentId,
            homework_id: homeworkId,
            name: name,
            homework_status: {
              yapildi: false,
              yapilmadi: false,
              eksik: false,
              gelmedi: false,
            },
          },
        ])
      })

      await Promise.all(insertPromises)

      // Başarılı ise ödev listesini güncelle
      fetchHomeworkList()
      // handleAssignHomework(homeworkId) // Tüm öğrencilere eklenen ödevi ata
      resetForm() // Formu sıfırla
    } catch (error) {
      console.error('Error adding homework:', error)
    }
  }

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Ödev adı gereklidir'),
  })

  const handleDelete = async (homeworkId) => {
    const { error } = await supabase
      .from('homeworks')
      .delete()
      .eq('id', homeworkId)
    if (error) {
      console.error('Error deleting homework:', error)
    } else {
      fetchHomeworkList()
    }
  }

  const handleUpdate = async (homeworkId) => {
    // Örneğin, status'u güncellemek istiyorsanız buraya ekleyebilirsiniz
    const { error } = await supabase
      .from('homeworks')
      .update({
        status: {
          yapildi: true,
          yapilmadi: false,
          eksik: false,
          gelmedi: false,
        },
      })
      .eq('id', homeworkId)
    if (error) {
      console.error('Error updating homework:', error)
    } else {
      fetchHomeworkList()
    }
  }

  if (loading) return <p>Loading...</p>

  return (
    <div className="mt-8 flex flex-col gap-3 pb-20 pt-8 border-b-2">
      <h1 className="flex bg-blue-500 justify-center items-center rounded-md w-full mb-2 h-8 text-xl text-white font-semibold">
        Ödev Ekle
      </h1>
      <Formik
        initialValues={{ name: '', selectedStudents: [] }}
        validationSchema={validationSchema}
        onSubmit={handleAddHomework}
      >
        {({ values, handleChange }) => (
          <Form>
            <div className="flex items-center">
              <label htmlFor="name">Ödev Adı:</label>
              <Field
                name="name"
                type="text"
                id="name"
                className="ml-4 w-72 border border-red-600 rounded-md"
              />
              <ErrorMessage
                name="name"
                component="div"
                style={{ color: 'red' }}
              />
            </div>

            <div className="mt-4">
              <label htmlFor="selectedStudents">Öğrenci Seç:</label>
              <Field
                as="select"
                name="selectedStudents"
                id="selectedStudents"
                multiple
                onChange={handleChange} // Handle change to update selected values
                className="w-72 border border-red-600 rounded-md overflow-y-auto"
              >
                {students.map((student) => (
                  <option
                    key={student.id}
                    value={student.id}
                    className="flex items-center p-1"
                  >
                    {student.name}
                  </option>
                ))}
              </Field>
              <ErrorMessage
                name="selectedStudents"
                component="div"
                style={{ color: 'red' }}
              />
            </div>

            <button className="mt-4 w-48 bg-yellow-500 rounded" type="submit">
              Ekle
            </button>
          </Form>
        )}
      </Formik>

      {/* <h2>Ödev Listesi</h2>
      <ul>
        {homeworkList.map((homework) => (
          <li key={homework.id} className="border-b py-2">
            <div>
              <h2>Name: {homework.name}</h2>
              <p>
                <button
                  onClick={() => handleDelete(homework.id)}
                  className="mr-2 px-2 py-1 rounded bg-red-600 w-20"
                >
                  Sil
                </button>
                <button
                  onClick={() => handleUpdate(homework.id)}
                  className="mr-2 px-2 py-1 rounded bg-blue-600 w-20"
                >
                  Güncelle
                </button>
              </p>
            </div>
            <p>Status: {JSON.stringify(homework.status)}</p>
          </li>
        ))}
      </ul> */}
    </div>
  )
}

export default HomeworkList
