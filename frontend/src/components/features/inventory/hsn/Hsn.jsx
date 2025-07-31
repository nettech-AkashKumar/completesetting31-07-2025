import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { FaFileExcel, FaFilePdf } from 'react-icons/fa';
import { CiCirclePlus } from 'react-icons/ci';
import { TbEdit, TbTrash } from 'react-icons/tb';
import AddHsnModals from '../../../../pages/Modal/hsn/AddHsnModals';
import { toast } from 'react-toastify';
import BASE_URL from '../../../../pages/config/config';


const HSNList = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [pages, setPages] = useState(1);
  const [modalData, setModalData] = useState({ hsnCode: '', description: '', id: null });
  const [showModal, setShowModal] = useState(false);
  useEffect(() => { load(); }, [page]);

  const load = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/hsn/paginated`, {
        params: { page, limit }
      });
      setData(res.data.items);
      setPages(res.data.pages);
    } catch (err) {
      console.error('Error loading HSN:', err);
    }
  };

  const remove = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/api/hsn/${id}`);
      load();
    } catch (err) {
      console.error('Error deleting HSN:', err);
    }
  };

  const handleExport = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/hsn/export`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'hsn.xlsx');
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      console.error('Export error:', err);
    }
  };

  // const handleImport = async (e) => {
  //   const file = e.target.files?.[0];
  //   if (!file) return;
  //   const formData = new FormData();
  //   formData.append('file', file);

  //   try {
  //     await axios.post(`${BASE_URL}/api/hsn/import`, formData);
  //     load();
  //   } catch (err) {
  //     console.error('Import error:', err);
  //   }
  // };


  const fileInputRef = useRef(null);

  const handleImport = async e => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);        // <-- key MUST be 'file'

    try {
      await axios.post(`${BASE_URL}/api/hsn/import`, formData); // don’t set headers
      toast.success('Imported!');
      load();
    } catch (err) {
      toast.error('Import failed');
      console.error(err);
    } finally {
      // allow re‑uploading the same file later
      if (fileInputRef) fileInputRef.value = '';
    }
  };

  const handleModalSubmit = async () => {
    try {
      if (modalData.id) {
        await axios.put(`${BASE_URL}/api/hsn/${modalData.id}`, modalData);
      } else {
        await axios.post(`${BASE_URL}/api/hsn`, modalData);
      }
      setModalData({ hsnCode: '', description: '', id: null });
      setShowModal(false);
      load();
    } catch (err) {
      console.error('Save error:', err);
    }
  };

  const openModal = (item = null) => {
    if (item) setModalData({ hsnCode: item.hsnCode, description: item.description, id: item._id });
    else setModalData({ hsnCode: '', description: '', id: null });
    setShowModal(true);
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="add-item d-flex">
            <div className="page-title">
              <h4 className="fw-bold">Hsn List</h4>
              <h6>Manage your Hsn</h6>
            </div>
          </div>
          <div className="table-top-head me-2">
            <li>
              {/* PDF Export: HSN Code & Description */}
              <button
                type="button"
                className="icon-btn"
                title="Export PDF"
                onClick={async () => {
                  const jsPDF = (await import('jspdf')).default;
                  const autoTable = (await import('jspdf-autotable')).default;
                  const doc = new jsPDF();
                  autoTable(doc, {
                    head: [["HSN Code", "Description"]],
                    body: data.map(row => [row.hsnCode, row.description]),
                  });
                  doc.save('hsn-list.pdf');
                }}
              >
                <FaFilePdf />
              </button>
            </li>
            <li>
              {/* IMPORT Excel: HSN Code & Description */}
              <label className="icon-btn m-0" title="Import Excel">
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  hidden
                  onChange={handleImport}
                  ref={fileInputRef}
                />
                <FaFileExcel style={{ color: 'green', cursor: 'pointer' }} />
              </label>
            </li>
            <li>
              {/* EXPORT Excel: HSN Code & Description */}
              <button
                type="button"
                className="icon-btn"
                title="Export Excel"
                onClick={handleExport}
              >
                <FaFileExcel />
              </button>
            </li>
          </div>
          <div className="page-btn">
            <a
              href="#"
              className="btn btn-primary"
              data-bs-toggle="modal"
              // data-bs-target="#add-brand"
              onClick={() => openModal()}
            >
              <CiCirclePlus className=" me-1" />
              Add Hsn
            </a>
          </div>
        </div>
        {/* /product list */}
        <div className="card">
          <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
            <div className="search-set">
              <div className="search-input">
                <input
                  type="text"
                  placeholder="Search hsn code..."
                  className="form-control"

                />
              </div>
            </div>
            {/* <div className="d-flex table-dropdown my-xl-auto right-content align-items-center flex-wrap row-gap-3">
              <div className="dropdown me-2">
                <a
                  className="dropdown-toggle btn btn-white btn-md d-inline-flex align-items-center"
                  data-bs-toggle="dropdown"
                >
                  Status
                </a>
                <ul className="dropdown-menu  dropdown-menu-end p-3">
                  <li>
                    <a
                      onClick={() => setStatusFilter("All")}
                      className="dropdown-item rounded-1"
                    >
                      All
                    </a>
                  </li>
                  <li>
                    <a
                      onClick={() => setStatusFilter("Active")}
                      className="dropdown-item rounded-1"
                    >
                      Active
                    </a>
                  </li>
                  <li>
                    <a
                      onClick={() => setStatusFilter("Inactive")}
                      className="dropdown-item rounded-1"
                    >
                      Inactive
                    </a>
                  </li>
                </ul>
              </div>
              <div className="dropdown">
                <a
                  href="javascript:void(0);"
                  className="dropdown-toggle btn btn-white btn-md d-inline-flex align-items-center"
                  data-bs-toggle="dropdown"
                >
                  Sort By : Latest
                </a>
                <ul className="dropdown-menu  dropdown-menu-end p-3">
                  <li>
                    <a
                      onClick={() => setSortOrder("Latest")}
                      className="dropdown-item rounded-1"
                    >
                      Latest
                    </a>
                  </li>
                  <li>
                    <a
                      onClick={() => setSortOrder("Ascending")}
                      className="dropdown-item rounded-1"
                    >
                      Ascending
                    </a>
                  </li>
                  <li>
                    <a
                      onClick={() => setSortOrder("Descending")}
                      className="dropdown-item rounded-1"
                    >
                      Descending
                    </a>
                  </li>
                </ul>
              </div>
            </div> */}
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table datatable">
                <thead className="thead-light">
                  <tr>
                    <th className="no-sort">
                      <label className="checkboxs">
                        <input type="checkbox" id="select-all" />
                        <span className="checkmarks" />
                      </label>
                    </th>
                    <th>HSN Code</th>
                    <th>Description</th>
                    <th>Created Date</th>
                    <th className="no-sort" />
                  </tr>
                </thead>
                <tbody>
                  {data.map((hsn) => (
                    <tr key={hsn._id}>
                      <td>
                        <label className="checkboxs">
                          <input type="checkbox" />
                          <span className="checkmarks" />
                        </label>
                      </td>
                      <td>{hsn.hsnCode}</td>
                      <td>{hsn.description}</td>
                      <td>{new Date(hsn.createdAt).toLocaleDateString()}</td>

                      <td className="action-table-data">
                        <div className="edit-delete-action">
                          <a
                            className="me-2 p-2"
                            data-bs-toggle="modal"
                            data-bs-target="#edit-brand"
                            onClick={() => openModal(hsn)}
                          >
                            <TbEdit />
                          </a>

                          <a
                            className="p-2"
                            // onClick={() =>
                            //   handleDeleteBrand(brand._id, brand.brandName)
                            // }
                            onClick={() => remove(hsn._id)}

                          >
                            <TbTrash />
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
            {/* pagination */}
            {/* <div className="d-flex justify-content-between align-items-center p-3">

              <div className="d-flex justify-content-end align-items-center">
                <label className="me-2">Items per page:</label>
                <select
                  value={itemsPerPage}

                  className="form-select w-auto"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
              <div>
                <button
                  className="btn btn-light btn-sm me-2"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                >
                  Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    className={`btn btn-sm me-1 ${currentPage === i + 1
                      ? "btn-primary"
                      : "btn-outline-primary"
                      }`}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  className="btn btn-light btn-sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </div> */}
          </div>
        </div>

        <AddHsnModals
          show={showModal}
          onClose={() => setShowModal(false)}
          modalData={modalData}
          setModalData={setModalData}
          onSubmit={handleModalSubmit}
        />
        {/* /product list */}
        <div>
          {/* Add Brand */}
          {/* <div className="modal fade" id="add-brand">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <div className="page-title">
                    <h4>Add Brand</h4>
                  </div>
                  <button
                    type="button"
                    className="close bg-danger text-white fs-16"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  >
                    <span aria-hidden="true">×</span>
                  </button>
                </div>
                <form onSubmit={handleAddBrand}>
                  <div className="modal-body new-employee-field">
                    <div className="profile-pic-upload mb-3">
                      <div className="profile-pic brand-pic">
                        <span>
                          {selectedImages.length > 0 ? (
                            <img
                              src={URL.createObjectURL(selectedImages[0])}
                              alt="Preview"
                              height="60"
                            />
                          ) : (
                            <>
                              <CiCirclePlus className="plus-down-add" /> Add
                              Image
                            </>
                          )}{" "}
                        </span>
                      </div>
                      <div>
                        <div className="image-upload mb-0">
                          <input
                            type="file"
                            accept="image/png, image/jpeg"
                            onChange={(e) =>
                              setSelectedImages(Array.from(e.target.files))
                            }
                          />
                          <div className="image-uploads">
                            <h4>Upload Image</h4>
                          </div>
                        </div>
                        <p className="mt-2">JPEG, PNG up to 2 MB</p>
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">
                        Brand<span className="text-danger ms-1">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={brandName}
                        onChange={(e) => setBrandName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="mb-0">
                      <div className="status-toggle modal-status d-flex justify-content-between align-items-center">
                        <span className="status-label">Status</span>
                        <input
                          type="checkbox"
                          id="user2"
                          className="check"
                          checked={status}
                          onChange={(e) => setStatus(e.target.checked)}
                        />
                        <label htmlFor="user2" className="checktoggle" />
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn me-2 btn-secondary"
                      data-bs-dismiss="modal"
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Add Brand
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div> */}
          {/* /Add Brand */}
        </div>

        {/* <div className="modal fade" id="edit-brand">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <div className="page-title">
                  <h4>Edit Brand</h4>
                </div>
                <button
                  type="button"
                  className="close bg-danger text-white fs-16"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <form onSubmit={handleEditBrand}>
                <div className="modal-body new-employee-field">
                  <div className="profile-pic-upload mb-3">
                    <div className="profile-pic brand-pic">
                      <span>
                        {editImagePreview && (
                          <img
                            src={editImagePreview}
                            alt="Current"
                            height="60"
                          />
                        )}
                      </span>
                      <a href="javascript:void(0);" className="remove-photo">
                        <i data-feather="x" className="x-square-add" />
                      </a>
                    </div>
                    <div>

                      <div className="image-upload mb-0">
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={(e) => {
                            const files = Array.from(e.target.files);
                            setSelectedImages(files);
                            if (files[0]) {
                              setEditImagePreview(
                                URL.createObjectURL(files[0])
                              );
                            }
                          }}
                        />
                        <div className="image-uploads">
                          <h4>Change Image</h4>
                        </div>
                      </div>

                      <p className="mt-2">JPEG, PNG up to 2 MB</p>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      Brand<span className="text-danger ms-1">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={editBrandName}
                      onChange={(e) => setEditBrandName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-0">
                    <div className="status-toggle modal-status d-flex justify-content-between align-items-center">
                      <span className="status-label">Status</span>
                      <input
                        type="checkbox"
                        id="user4"
                        className="check"
                        checked={editStatus}
                        onChange={(e) => setEditStatus(e.target.checked)}
                      />
                      <label htmlFor="user4" className="checktoggle" />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn me-2 btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div> */}
      </div>
    </div>
    // <div className="container mt-4">
    //   <h2>HSN Master</h2>
    //   <button className="btn btn-primary mb-2" onClick={() => openModal()}>Add HSN</button>
    //   <input type="file" onChange={handleImport} className="form-control my-2" /><FaFileExcel style={{ color: "green" }} />
    //   <button className="btn btn-success mb-2" onClick={handleExport}>Export Excel</button>
    //   <table className="table table-bordered">
    //     <thead><tr><th>#</th><th>HSN Code</th><th>Description</th><th>Actions</th></tr></thead>
    //     <tbody>
    //       {data.map((d, i) => (
    //         <tr key={d._id}>
    //           <td>{(page - 1) * limit + i + 1}</td>
    //           <td>{d.hsnCode}</td>
    //           <td>{d.description}</td>
    //           <td>
    //             <button className="btn btn-warning btn-sm me-2" onClick={() => openModal(d)}>Edit</button>
    //             <button className="btn btn-danger btn-sm" onClick={() => remove(d._id)}>Delete</button>
    //           </td>
    //         </tr>
    //       ))}
    //     </tbody>
    //   </table>
    //   <div className="d-flex justify-content-between">
    //     <button className="btn btn-secondary" disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</button>
    //     <span>Page {page} of {pages}</span>
    //     <button className="btn btn-secondary" disabled={page === pages} onClick={() => setPage(page + 1)}>Next</button>
    //   </div>

    //   {/* Modal */}
    //   {showModal && (
    //     <div className="modal d-block" tabIndex="-1" role="dialog">
    //       <div className="modal-dialog" role="document">
    //         <div className="modal-content">
    //           <div className="modal-header">
    //             <h5 className="modal-title">{modalData.id ? 'Edit HSN' : 'Add HSN'}</h5>
    //             <button type="button" className="close" onClick={() => setShowModal(false)}>
    //               <span>&times;</span>
    //             </button>
    //           </div>
    //           <div className="modal-body">
    //             <input
    //               className="form-control my-2"
    //               placeholder="HSN Code"
    //               value={modalData.hsnCode}
    //               onChange={e => setModalData({ ...modalData, hsnCode: e.target.value })}
    //             />
    //             <input
    //               className="form-control my-2"
    //               placeholder="Description"
    //               value={modalData.description}
    //               onChange={e => setModalData({ ...modalData, description: e.target.value })}
    //             />
    //           </div>
    //           <div className="modal-footer">
    //             <button className="btn btn-primary" onClick={handleModalSubmit}>Save</button>
    //             <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   )}
    // </div>


  );
};

export default HSNList;
