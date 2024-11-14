import React, { useState } from 'react'
import StudentList from './web/StudentList'
import HomeworksList from './web/HomeworksList'
import AddStudent from './web/AddStudent'
import HomeworksFilter from './web/HomeworksFilter'

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
