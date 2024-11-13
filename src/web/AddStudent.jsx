import React, { useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { v4 as uuidv4 } from '../../node_modules/uuid/dist/esm-browser/index'
import { addStudent } from '../services/studentServices'
import HomeworksList from './HomeworksList'

const AddStudent = () => {
  const validationSchema = Yup.object({
    name: Yup.string().required('İsim gereklidir.'),
    class: Yup.string().required('Sınıf gereklidir.'),
  })

  return (
    <div>
      <h1 className='flex bg-blue-500 justify-center items-center rounded-md w-full mb-2 h-8 text-xl text-white font-semibold'>Öğrenci Ekle</h1>
      <Formik
        initialValues={{
          id: uuidv4(), // Her öğrenciye benzersiz bir ID atar
          no: '',
          name: '',
          class: '',
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { resetForm }) => {
          const studentData = {
            id: uuidv4(),
            no: values.no,
            name: values.name,
            class: values.class,
          }

          // Öğrenciyi kaydetmek için addStudent fonksiyonunu çağırıyoruz
          addStudent(studentData)
            .then(() => {
              console.log('Öğrenci kaydedildi:', studentData)
              resetForm() // Formu temizler
            })
            .catch((error) => {
              console.error('Öğrenci kaydedilemedi:', error)
            })
        }}
      >
        {({ handleSubmit }) => (
          <Form onSubmit={handleSubmit} className="flex gap-4">
            <div>
              <label htmlFor="no">No: </label>
              <Field
                type="text"
                id="no"
                name="no"
                placeholder="Öğrenci no"
                className="border rounded px-3 py-2"
              />
              <ErrorMessage
                name="no"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>
            <div>
              <label htmlFor="name">İsim: </label>
              <Field
                type="text"
                id="name"
                name="name"
                placeholder="Öğrenci ismi"
                className="border rounded px-3 py-2"
              />
              <ErrorMessage
                name="name"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div>
              <label htmlFor="class">Sınıf: </label>
              <Field
                type="text"
                id="class"
                name="class"
                placeholder="Öğrenci sınıfı"
                className="border rounded px-3 py-2"
              />
              <ErrorMessage
                name="class"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>
            <div>
              <button
                type="submit"
                className="bg-blue-500 text-white p-2  rounded"
              >
                Kaydet
              </button>
            </div>
          </Form>
        )}
      </Formik>
      <HomeworksList />
    </div>
  )
}

export default AddStudent
