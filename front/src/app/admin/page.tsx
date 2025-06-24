"use client"


import { Carousel } from '@/components/product/Carousel';
import CreateProduct from '@/components/product/CreateProduct';
 


function Admin() {
  return (
    <>
      <CreateProduct  />
      <br />
      <Carousel/>
    </>
  )
}

export default Admin
