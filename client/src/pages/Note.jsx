import axios from 'axios'
import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import config from '../config';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import Swal from 'sweetalert2'

import noteimg from '../images/addnote.png'

import Pagination from '../components/Pagination';
import Category from '../components/Category';

// icon
import { BiSolidEdit } from "react-icons/bi";
import { MdDeleteOutline } from "react-icons/md";

const Note = () => {
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [categories, setCategories] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [notesPerPage] = useState(8);

  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteCategory, setNoteCategory] = useState('');

  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [updateNoteId, setUpdateNoteId] = useState(null);

  const navigate = useNavigate();
  const createNoteDialog = useRef(null);

  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
    fetchNotes();
    fetchCategories();
  }, [navigate]);

  const handleCategoryChange = () => {
    fetchCategories();
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:8888/categories", config.headers());
      setCategories(response.data);
    } catch (error) {
      console.error("error fetching categories", error);
    }
  };

  const handleNoteSubmit = async (e) => {
    e.preventDefault();
    const email = localStorage.getItem('email');
    const noteData = { title: noteTitle, content: noteContent, categoryId: noteCategory, email: email };
    try {
      if (isUpdateMode) {
        await axios.put(`http://localhost:8888/note/${updateNoteId}`, noteData, config.headers());
        toast.success("Note updated successfully");
      } else {
        await axios.post("http://localhost:8888/note", noteData, config.headers());
        toast.success("Note created successfully");
      }
      setNoteTitle('');
      setNoteContent('');
      setNoteCategory('');
      setIsUpdateMode(false);
      setUpdateNoteId(null);
      fetchNotes();
      createNoteDialog.current.close();
    } catch (error) {
      console.error(error.response.data.message);
    }
  };

  const fetchNotes = async (categoryId = '') => {
    try {
      const response = await axios.get("http://localhost:8888/notes", config.headers());
      setNotes(response.data);
      if (categoryId) {
        const filtered = response.data.filter(note => note.categoryId === categoryId);
        setFilteredNotes(filtered);
      } else {
        setFilteredNotes(response.data);
      }
    } catch (error) {
      console.error("error", error);
    }
  };

  const handleDeleteNote = (id) => {
    try {
      Swal.fire({
        title: 'Delete!',
        text: 'Do you want to Delete Note',
        icon: 'question',
        showCancelButton: true,
        showCloseButton: true
      }).then(async res => {
        if (res.isConfirmed) {
          await axios.delete(`http://localhost:8888/note/${id}`, config.headers());
          toast.success("Delete Note Successful")
          fetchNotes()
        }
      })
    } catch (error) {
      console.error("error", error)
    }
  }

  const handleUpdateNote = (note) => {
    setIsUpdateMode(true);
    setUpdateNoteId(note._id);
    setNoteTitle(note.title);
    setNoteContent(note.content);
    setNoteCategory(note.categoryId);
    document.getElementById('createNote').showModal();
  };

  const resetForm = () => {
    setNoteTitle('');
    setNoteContent('');
    setNoteCategory('');
    setIsUpdateMode(false);
    setUpdateNoteId(null);
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    fetchNotes(categoryId);
  };

  const handleAllCategoriesSelect = () => {
    setSelectedCategory('');
    fetchNotes();
  };

  const openCreateNoteModal = () => {
    fetchCategories();
    document.getElementById('createNote').showModal();
  };

  const indexOfLastNote = currentPage * notesPerPage;
  const indexOfFirstNote = indexOfLastNote - notesPerPage;
  const currentNotes = filteredNotes.slice(indexOfFirstNote, indexOfLastNote);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className='mt-4'>
      <button className='absolute bottom-10 right-10 rounded-full w-16 h-16 text-2xl btn btn-warning mt-4'
        onClick={openCreateNoteModal}
      >
        +
      </button>

      <Category 
        onCategorySelect={handleCategorySelect} 
        onAllCategoriesSelect={handleAllCategoriesSelect} 
        onCategoryChange={handleCategoryChange}
      />

      <div className='mt-4'>
        {currentNotes.length > 0 ? (
          <div className='grid grid-cols-4 gap-3'>
            {currentNotes.map((note) => (
              <div key={note._id}>
                <div className="card bg-base-100 shadow-xl ">
                  <div className="card-body">
                    <h2 className="card-title">{note.title}</h2>
                    <p className='h-14'>{note.content}</p>
                    <div className='grid grid-cols-4'>
                      <span className='col-span-2 flex items-center'>
                        <p>{dayjs(note.createdAt).format("DD/MM/YYYY HH:mm")}</p>
                      </span>
                      <span className='col-span-2 flex justify-end'>
                        <button onClick={() => handleUpdateNote(note)}
                          className="btn btn-warning"
                        >
                          <BiSolidEdit className='text-lg' />
                        </button>
                        <button onClick={() => handleDeleteNote(note._id)}
                          className="btn btn-error ms-2"
                        >
                          <MdDeleteOutline className='text-lg' />
                        </button>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className='flex justify-center items-center h-full'>
            <img src={noteimg} className='text-center' width={450}/>
          </div>
        )}
      </div>

      <Pagination
        notesPerPage={notesPerPage}
        totalNotes={notes.length}
        paginate={paginate}
        currentPage={currentPage}
      />

      <dialog id="createNote" className="modal" ref={createNoteDialog}>
        <div className="modal-box">
          <h1 className="font-bold text-2xl mb-3">
            {isUpdateMode ? 'Update Note' : 'Create Note'}
          </h1>
          <form onSubmit={handleNoteSubmit}>
            <div>
              <label className="block text-gray-700 text-lg font-semibold">
                Title
              </label>
              <input
                type="text"
                className="input input-bordered w-full my-2"
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 text-lg font-semibold">
                Content
              </label>
              <input
                type="text"
                className="input input-bordered w-full my-2"
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 text-lg font-semibold">
                Category
              </label>
              <select 
                className="select select-bordered w-full my-2"
                value={noteCategory}
                onChange={(e) => setNoteCategory(e.target.value)}
              >
                <option value="" disabled >Select a category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.category}
                  </option>
                ))}
              </select>
            </div>

            <div className='text-end'>
              <button type="submit" className='btn btn-primary mt-2'>
                {isUpdateMode ? 'Update' : 'Submit'}
              </button>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop" onSubmit={resetForm}>
          <button>close</button>
        </form>
      </dialog>
    </div>
  )
}

export default Note