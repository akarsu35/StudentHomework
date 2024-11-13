import { supabase } from '../services/supabaseClient'
import { v4 as uuidv4 } from '../../node_modules/uuid/dist/esm-browser/index'

export async function addStudent(student) {
  const { data, error } = await supabase
    .from('students')
    .insert(student)

  if (error) {
    console.log('Öğrenci eklerken hata oluştu:', error)
  } else {
    console.log('Öğrenci başarıyla eklendi')
  }
}

