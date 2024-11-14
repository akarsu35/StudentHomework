import { supabase } from './supabaseClient'

export async function assignHomeworkToAllStudents(homeworkId) {
  // tüm öğrencileri çek
  const { data: students, error: fetchError } = await supabase
    .from('students')
    .select('id')

  if (fetchError) {
    console.error(fetchError)
    return // Hata durumunda işlem sonlandırılıyor
  }

  // 2. Her öğrenci için student_homework tablosuna kayıt ekle
  const assignments = students.map((student) => ({
    student_id: student.id,
    homework_id: homeworkId,
  }))

  const { error: insertError } = await supabase
    .from('student_homework')
    .insert(assignments)

  if (insertError) {
    console.error('Error assigning homework to students:', insertError)
  } else {
    alert('Homework assigned to all students successfully')
  }
}

export async function filterHomeworks(status) {
  const { data: homeworks, error: fetchError } = await supabase.from('homeworks').select('*').eq(status)
  if (error) {
    console.log('data fetching error: ',error)
  }else{
    return homeworks
  }
  
}

 export async function handleAddHomework (values, { resetForm }) {
   const homeworkId = uuidv4()
   const { name, selectedStudents } = values

   try {
     // İlk olarak homeworks tablosuna yeni bir ödev ekleyin
     const { error: homeworkError } = await supabase
       .from('homeworks')
       .insert([{ id: homeworkId, name }])

     if (homeworkError) {
       console.error('Error adding homework to homeworks table:', homeworkError)
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
             yapilmadi: true,
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