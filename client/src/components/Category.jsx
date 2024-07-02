import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import config from '../config';
import { BsBookmarkPlus } from "react-icons/bs";
import { BiSolidEdit } from "react-icons/bi";
import { MdDeleteOutline } from "react-icons/md";

const Category = ({ onCategorySelect, onAllCategoriesSelect, onCategoryChange }) => {
    const [categories, setCategories] = useState([]);
    const [categoryName, setCategoryName] = useState('');
    const [isUpdateCategoryMode, setIsUpdateCategoryMode] = useState(false);
    const [updateCategoryId, setUpdateCategoryId] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const createCategoryDialog = useRef(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get("http://localhost:8888/categories", config.headers());
            setCategories(response.data);
        } catch (error) {
            console.error("error", error);
        }
    };

    const handleCategorySubmit = async (e) => {
        e.preventDefault();
        try {
            if (isUpdateCategoryMode) {
                await axios.put(`http://localhost:8888/categories/${updateCategoryId}`, { categoryName }, config.headers());
                toast.success("Category updated successfully");
            } else {
                await axios.post("http://localhost:8888/categories", { categoryName }, config.headers());
                toast.success("Create category successful");
            }
            setCategoryName('');
            setIsUpdateCategoryMode(false);
            setUpdateCategoryId(null);
            fetchCategories();
            createCategoryDialog.current.close();
            onCategoryChange();
        } catch (error) {
            console.error(error.response.data.message);
        }
    };

    const handleDeleteCategory = async (id) => {
        try {
            await axios.delete(`http://localhost:8888/categories/${id}`, config.headers());
            toast.success("Delete Category Successful");
            fetchCategories();
        } catch (error) {
            console.error("error", error);
        }
    };

    const handleUpdateCategory = (category) => {
        setIsUpdateCategoryMode(true);
        setUpdateCategoryId(category._id);
        setCategoryName(category.category);
        document.getElementById('createCategory').showModal();
    };

    const resetCategoryForm = () => {
        setCategoryName('');
        setIsUpdateCategoryMode(false);
        setUpdateCategoryId(null);
    };

    const handleCategorySelect = (categoryId) => {
        setSelectedCategory(categoryId);
        onCategorySelect(categoryId);
    };

    const handleAllCategoriesSelect = () => {
        setSelectedCategory(null);
        onAllCategoriesSelect();
    };

    return (
        <>
            <div className="overflow-x-auto mt-4 flex gap-3">
                <button
                    className={`btn rounded-full w-24 ${selectedCategory === null ? 'btn-warning' : ''}`}
                    onClick={handleAllCategoriesSelect}
                >
                    All
                </button>
                {categories.map((category) => (
                    <div key={category._id}>
                        <button
                            className={`btn rounded-full w-24 ${selectedCategory === category._id ? 'btn-warning' : ''}`}
                            onClick={() => handleCategorySelect(category._id)}
                        >
                            {category.category}
                        </button>
                    </div>
                ))}
                <button
                    className='btn btn-warning rounded-full'
                    onClick={() => document.getElementById('createCategory').showModal()}
                >
                    <BsBookmarkPlus />
                </button>
            </div>

            <dialog id="createCategory" className="modal" ref={createCategoryDialog}>
                <div className="modal-box">
                    <h1 className="font-bold text-2xl mb-3">
                        {isUpdateCategoryMode ? 'Update Category' : 'Create Category'}
                    </h1>

                    <form onSubmit={handleCategorySubmit}>
                        <div>
                            <label className="block text-gray-700 text-lg font-semibold">
                                Category
                            </label>
                            <input
                                type="text"
                                className="input input-bordered w-full my-2"
                                value={categoryName}
                                onChange={(e) => setCategoryName(e.target.value)}
                            />
                        </div>
                        <div className='text-end'>
                            <button type="submit" className='btn btn-primary mt-2'>
                                {isUpdateCategoryMode ? 'Update' : 'Submit'}
                            </button>
                        </div>

                        <hr className='my-4' />

                        <div className="grid grid-cols-2" >
                            {categories.map((category) => (
                                <div key={category._id} className='flex justify-between p-2 bg-zinc-100 rounded-lg m-1'>
                                    <div className='flex items-center ps-2'>
                                        <div>{category.category}</div>
                                    </div>
                                    <div>
                                        <button onClick={() => handleUpdateCategory(category)}
                                            className='btn btn-warning'
                                        >
                                            <BiSolidEdit className='text-lg' />
                                        </button>
                                        <button onClick={() => handleDeleteCategory(category._id)}
                                            className='btn btn-error ms-2'
                                        >
                                            <MdDeleteOutline className='text-lg' />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </form>
                </div>
                <form method="dialog" className="modal-backdrop" onSubmit={resetCategoryForm}>
                    <button>close</button>
                </form>
            </dialog>
        </>
    );
};

export default Category;