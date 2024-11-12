import React, { useEffect, useState } from 'react'
import { supabase } from '../services/supabaseClient'
import { assignHomeworkToAllStudents } from '../services/homeworkServices'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { v4 as uuidv4 } from '/Users/cumhur/Documents/homeworks/node_modules/uuid/dist/esm-browser/index'

const HomeworkList = () => {
  const [homeworkList, setHomeworkList] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchHomeworkList()
  }, [])

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
    const { error } = await supabase
      .from('homeworks')
      .insert([
        {
          id: homeworkId,
          name: values.name,
          status: {
            yapildi: false,
            yapilmadi: true,
            eksik: false,
            gelmedi: false,
          },
        },
      ])

    if (error) {
      console.error('Error adding homework:', error)
    } else {
      fetchHomeworkList() // Yeni ödev listesini güncelle
      handleAssignHomework(homeworkId) // Tüm öğrencilere eklenen ödevi ata
      resetForm() // Formu sıfırla
    }
  }

  // insert to homework for all students
  const handleAssignHomework = async (homeworkId) => {
    await assignHomeworkToAllStudents(homeworkId)
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
    <div>
      <h1>Ödev Ekle</h1>
      <Formik
        initialValues={{ name: '' }}
        validationSchema={validationSchema}
        onSubmit={handleAddHomework}
      >
        {() => (
          <Form>
            <div>
              <label htmlFor="name">Ödev Adı:</label>
              <Field
                name="name"
                type="text"
                id="name"
                className="w-400 border border-red-600 rounded-md"
              />
              <ErrorMessage
                name="name"
                component="div"
                style={{ color: 'red' }}
              />
            </div>
            <button className="w-20 bg-yellow-500 rounded" type="submit">
              Ekle
            </button>
          </Form>
        )}
      </Formik>

      <h2>Ödev Listesi</h2>
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
      </ul>
    </div>
  )
}

export default HomeworkList
