import { supabase } from '../services/supabaseClient'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { useEffect, useState } from 'react'

const HomeworksFilter = () => {
  const [filteredHomework, setFilteredHomework] = useState([])
  const [homeworkList, setHomeworkList] = useState([])

  useEffect(() => {
    fetchHomeworkList()
  }, [])

  // Veritabanından ödevleri çekme fonksiyonu
  const fetchHomeworkList = async () => {
    const { data, error } = await supabase.from('homeworks').select('*')
    if (error) {
      console.error('Ödevleri çekerken bir hata oluştu:', error)
    } else {
      setHomeworkList(data)
      console.log('Ödev listesi:', data) // Veriyi doğru şekilde aldığınızı kontrol edin
    }
  }

  // Filtreleme fonksiyonu
  const filterHomework = (values) => {
    const { search } = values // Formik'ten gelen arama değeri
    console.log('Aranan ödev: ', search)

    // Status'e göre filtreleme
    if (search === 'yapıldı') {
      setFilteredHomework(
        homeworkList.filter((homework) => homework.status.yapildi === true)
      )
    } else if (search === 'yapılmadı') {
      setFilteredHomework(
        homeworkList.filter((homework) => homework.status.yapilmadi === true)
      )
    } else if (search === 'eksik') {
      setFilteredHomework(
        homeworkList.filter((homework) => homework.status.eksik === true)
      )
    } else if (search === 'gelmedi') {
      setFilteredHomework(
        homeworkList.filter((homework) => homework.status.gelmedi === true)
      )
    } else {
      // Arama değeri girilmediyse veya tanımlı bir durum değilse boş liste döndür
      setFilteredHomework([])
      console.log('Boş liste')
    }
  }

  return (
    <div>
      <h2>Ödev Arama</h2>
      <Formik initialValues={{ search: '' }} onSubmit={filterHomework}>
        {({ setFieldValue }) => (
          <Form className="flex flex-wrap items-center gap-2 mb-4">
            <Field
              name="search"
              type="text"
              placeholder="Ödev ismini giriniz"
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

      {/* Filtrelenmiş ödevleri listeleyin */}
      <div>
        {filteredHomework.length > 0 ? (
          <ul>
            {filteredHomework.map((homework) => (
              <li key={homework.id}>{homework.name}</li>
            ))}
          </ul>
        ) : (
          <p>Hiç ödev bulunamadı.</p>
        )}
      </div>
    </div>
  )
}

export default HomeworksFilter
