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
