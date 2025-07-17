import React from 'react'
import Home from './pages/Home'
import { Route, Routes } from 'react-router-dom'
import Layout from './pages/Layout'
import Dashboard from './pages/Dashboard'
import WriteArticles from './pages/WriteArticles'
import BlogTitle from './pages/BlogTitle'
import GenreteImages from './pages/GenreteImages'
import RemoveBackground from './pages/RemoveBackground'
import RemoveObject from './pages/RemoveObject'
import ReviewResume from './pages/ReviewResume'
import Community from './pages/Community'

function App() {
  return (
    <div>
     <Routes>
      <Route path="/" element={<Home />} />
      <Route path='/ai' element={<Layout/>}>
      <Route index element={<Dashboard/>}/>
       <Route path='write-article' element={<WriteArticles/>}/>
       <Route path='blog-titles' element={<BlogTitle/>}/>
        <Route path='generate-images' element={<GenreteImages/>}/>
       <Route path='remove-background' element={<RemoveBackground/>}/>
        <Route path='remove-object' element={<RemoveObject/>}/>
       <Route path='review-resume' element={<ReviewResume/>}/>
        <Route path='community' element={<Community/>}/>
      </Route>
     </Routes>
    </div>
  )
}

export default App
