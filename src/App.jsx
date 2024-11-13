import React, { useState } from 'react'
import StudentList from './web/StudentList'
import HomeworksList from './web/HomeworksList'
import AddStudent from './web/AddStudent'

function App() {
  

  return (
    <div className="app p-4 flex flex-col">
      <AddStudent />
      {/* <HomeworksList /> */}
      <StudentList />
    </div>
  )
}

export default App
