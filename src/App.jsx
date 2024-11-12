import React, { useState } from 'react'
import StudentList from './web/StudentList'
import HomeworksList from './web/HomeworksList'

function App() {
  

  return (
    <div className="app p-4">
     <StudentList/>
     <HomeworksList/>
    </div>
  )
}

export default App
