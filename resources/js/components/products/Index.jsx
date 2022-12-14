import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Index = () => {

    const navigate = useNavigate()

    const [products, setProducts] = useState([])

    const newProduct = () => {
        navigate("/product/new")
    }

    useEffect(()=>{
        getProducts()
    },[])

    const getProducts = async () => {
        await axios.get("/api/get_all_product")
            .then(({data})=>{
                setProducts(data.products)
            })
    }

    const editProduct = (id) => {
        navigate('/product/edit/'+id)
    }

    const deleteProduct = async (id) => {
        Swal.fire({
            title: "Are you sure ?",
            text: "You won't be able to revert this !",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it !"
        })
        .then((result)=>{
            if (result.isConfirmed) {
                axios.get('/api/delete_product/'+id)
                    .then(()=>{
                        Swal.fire(
                            'Deleted',
                            'Product succefully deleted',
                            'success'
                        )
                        getProducts()
                    })
                    .catch(()=>{

                    })
            }
        })
    }

    /* Filtrer les resultats */
    const [query, setQuery] = useState("");
    /* console.log(products.filter(products=>products.name.toLowerCase().includes("p"))); */
    const keys = ["name", "type"]
    /* console.log(products[0]["name"]) */

    const search = (data)=>{
        return data.filter((products) =>
                /* products.name.toLowerCase().includes(query) ||
                products.type.toLowerCase().includes(query)) */
                keys.some((key) => products[key].toLowerCase().includes(query))
        )
    }

    return (
        <div className="container">
            <div className="products_list">
                <div className="titlebar">
                    <div className="titlebar_item">
                        <h1>Products</h1>
                    </div>
                    <div className="titlebar_item">
                        <div className="btn" onClick={()=>newProduct()}>
                            Add Product
                        </div>
                    </div>
                </div>
                <p>Search</p>
                <input
                    type="text"
                    name="search-bar"
                    className="search-bar"
                    placeholder="Search by name or type..."
                    onChange={e=> setQuery(e.target.value)}
                />
                <div className="table">
                    <div className="list_header">
                        <p>Image</p>
                        <p>Product</p>
                        <p>Type</p>
                        <p>Inventory</p>
                        <p>Action</p>
                    </div>
                    {
                        products.length > 0 && (
                            products.filter((products) => keys.some((key) => products[key].toLowerCase().includes(query))).map((item, key)=>(
                                <div className="list_items" key={key}>
                                    <img src={`/upload/${item.photo}`} height="40px" alt="" />
                                    <a>{item.name}</a>
                                    <p>{item.type}</p>
                                    <p>{item.quantity}</p>
                                    <div>
                                        <button className="btn-icon success" onClick={()=>editProduct(item.id)}>
                                            <i className="fas fa-pencil-alt"></i>
                                        </button>
                                        <button className="btn-icon danger" onClick={()=>deleteProduct(item.id)}>
                                            <i className="far fa-trash-alt"></i>
                                        </button>
                                    </div>
                                </div>
                            ))
                        )
                    }

                </div>
            </div>
        </div>
    )
}

export default Index
