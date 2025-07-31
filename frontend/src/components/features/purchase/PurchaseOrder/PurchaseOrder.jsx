// full final code
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import BASE_URL from "../../../../pages/config/config";
// import { useSettings } from "../../../../Context/purchase/PurchaseContext";
// import "../../../../styles/product/product.css";
// import { FaFileExcel, FaFilePdf } from "react-icons/fa";
// import { CiCirclePlus } from "react-icons/ci";
// import AddPurchaseModal from "../../../../pages/Modal/PurchaseModals/AddPurchaseModal";
// import EditPurchaseModal from "../../../../pages/Modal/PurchaseModals/EditPurchaseModal";
// import { TbEdit, TbTrash } from "react-icons/tb";
// import DeleteAlert from "../../../../utils/sweetAlert/DeleteAlert";
// import Swal from "sweetalert2";


// const PurchaseOrder = () => {
//   const [purchases, setPurchases] = useState([]);
//   const [filters, setFilters] = useState({
//     search: "",
//     startDate: "",
//     endDate: "",
//   });
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const { settings } = useSettings();

//   const fetchPurchases = async () => {
//     try {
//       const res = await axios.get(`${BASE_URL}/api/purchases`, {
//         params: {
//           ...filters,
//           status: "Ordered",   // force only pending
//           page,
//           limit: 10,
//         },
//       });
//       setPurchases(res.data.purchases);
//       setTotalPages(res.data.totalPages);
//     } catch (error) {
//       console.error("Error fetching purchases:", error);
//     }
//   };

//   useEffect(() => {
//     fetchPurchases();
//   }, [filters, page]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFilters((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//     setPage(1);
//   };

//   const handlePageChange = (newPage) => {
//     if (newPage >= 1 && newPage <= totalPages) {
//       setPage(newPage);
//     }
//   };

//   const convertCurrency = (value) => {
//     if (!settings.conversionRates || !settings.baseCurrency) return value?.toFixed(2) || "0.00";
//     const baseToSelectedRate = settings.conversionRates[settings.currencyCode] || 1;
//     const baseToBaseRate = settings.conversionRates[settings.baseCurrency] || 1;
//     const converted = (value / baseToBaseRate) * baseToSelectedRate;
//     return converted.toFixed(2);
//   };

//   const [selectedPurchase, setSelectedPurchase] = useState(null);
//   // New: handle edit button click — set selected purchase and open modal
//   const handleEditClick = (purchase) => {
//     setSelectedPurchase(purchase);
//     // Open modal programmatically since React doesn’t auto open with state change
//     const editModal = new window.bootstrap.Modal(document.getElementById("edit-purchase"));
//     editModal.show();
//   };

//   const handleDeletePurchase = async (id, referenceNumber) => {
//     // if (!window.confirm("Are you sure you want to delete this purchase?")) return;
//     const confirmed = await DeleteAlert({});
//     if (!confirmed) return;

//     try {
//       await axios.delete(`${BASE_URL}/api/purchases/${id}`);
//       fetchPurchases(); // Refresh the table
//       // toast.success("purchases Deleted successfully!");
//       Swal.fire(
//         "Deleted!",
//         `purchases "${referenceNumber}" has been deleted.`,
//         "success"
//       );
//     } catch (error) {
//       console.error("Failed to delete purchase:", error);
//       // alert("Error deleting purchase. Please try again.");
//     }
//   };


//   return (
//     <div className="page-wrapper">
//       <div className="content">
//         <div className="page-header">
//           <div className="add-item d-flex">
//             <div className="page-title">
//               <h4 className="fw-bold">Purchase Orders</h4>
//               <h6>Manage your pending purchase orders</h6>
//             </div>
//           </div>
//           <div className="table-top-head me-2">
//             <li><button type="button" className="icon-btn" title="Pdf"><FaFilePdf /></button></li>
//             <li><label className="icon-btn m-0" title="Import Excel"><input type="file" accept=".xlsx, .xls" hidden /><FaFileExcel style={{ color: "green" }} /></label></li>
//             <li><button type="button" className="icon-btn" title="Export Excel"><FaFileExcel /></button></li>
//           </div>
//           <div className="d-flex gap-2">
//             <a className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#add-purchase"><CiCirclePlus className="me-1" />Add Purchase</a>
//           </div>
//         </div>

//         <div className="card">
//           <div className="card-header justify-content-between flex-wrap gap-3">
//             <div className="row">
//               <div className="col-md-4">
//                 <input type="text" name="search" className="form-control" placeholder="Search by product, supplier, or reference" value={filters.search} onChange={handleInputChange} />
//               </div>
//               <div className="col-md-4">
//                 <input type="date" name="startDate" className="form-control" value={filters.startDate} onChange={handleInputChange} />
//               </div>
//               <div className="col-md-4">
//                 <input type="date" name="endDate" className="form-control" value={filters.endDate} onChange={handleInputChange} />
//               </div>
//             </div>
//           </div>

//           <div className="card-body p-0">
//             <div className="table-responsive">
//               <table className="table datatable text-center align-middle">
//                 <thead className="thead-light text-center">
//                   <tr>
//                     <th><label className="checkboxs"><input type="checkbox" /><span className="checkmarks" /></label></th>
//                     <th>Supplier</th>
//                     <th>Reference</th>
//                     <th>Date</th>
//                     <th>Products</th>
//                     <th>Qyt</th>
//                     <th>Purchase Price</th>
//                     <th>Discount</th>
//                     <th>Tax(%)</th>
//                     <th>Tax Amount</th>
//                     <th>Shipping Charge</th>
//                     <th>Extra Expense</th>
//                     <th>Unit cost</th>
//                     <th>Total cost</th>
//                     <th>Status</th>
//                     <th>Action</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {purchases.length === 0 ? (
//                     <tr><td colSpan="7" className="text-center">No purchase orders found.</td></tr>
//                   ) : (
//                     purchases.map((purchase) => (
//                       <tr key={purchase._id}>
//                         <td><label className="checkboxs"><input type="checkbox" /><span className="checkmarks" /></label></td>
//                         <td>{purchase.supplier ? `${purchase.supplier.firstName} ${purchase.supplier.lastName}` : "N/A"}</td>
//                         <td>{purchase.referenceNumber}</td>
//                         <td>{new Date(purchase.purchaseDate).toLocaleDateString()}</td>
//                         <td>
//                           <ul>{purchase.products.map((p, idx) => (<li key={idx}>{p.product?.productName} - {p.quantity} × {settings.currencySymbol}{convertCurrency(p.purchasePrice)}</li>))}</ul>
//                         </td>
//                         <td><ul>{purchase.products.map((p, idx) => (<li key={idx}>{p.quantity} {p.unit}</li>))}</ul></td>
//                         <td><ul>{purchase.products.map((p, idx) => (<li key={idx}>{settings.currencySymbol}{convertCurrency(p.purchasePrice)}</li>))}</ul></td>
//                         <td><ul>{purchase.products.map((p, idx) => (<li key={idx}>{settings.currencySymbol}{convertCurrency(p.discount)}</li>))}</ul></td>
//                         <td><ul>{purchase.products.map((p, idx) => (<li key={idx}>{p.tax} %</li>))}</ul></td>
//                         <td><ul>{purchase.products.map((p, idx) => (<li key={idx}>{settings.currencySymbol}{convertCurrency(p.taxAmount || ((p.afterDiscount * p.tax) / 100 || 0))}</li>))}</ul></td>
//                         <td>{settings.currencySymbol}{convertCurrency(purchase.shippingCost)}</td>
//                         <td>{settings.currencySymbol}{convertCurrency(purchase.orderTax)}</td>
//                         <td><ul>{purchase.products.map((p, idx) => (<li key={idx}>{settings.currencySymbol}{convertCurrency(p.unitCost)}</li>))}</ul></td>
//                         <td><ul>{purchase.products.map((p, idx) => (<li key={idx}>{settings.currencySymbol}{convertCurrency(p.totalCost)}</li>))}</ul></td>
//                         <td><span className="badge bg-warning">{purchase.status}</span></td>
//                         <td className="action-table-data">
//                           <div className="edit-delete-action">
//                             <a className="me-2 p-2" data-bs-toggle="modal" data-bs-target="#edit-purchase" onClick={() => handleEditClick(purchase)}><TbEdit /></a>
//                             {/* <a className="p-2"><TbTrash /></a> */}
//                             <a className="p-2 text-danger" onClick={() => handleDeletePurchase(purchase._id, purchase.referenceNumber)} title="Delete Purchase">
//                               <TbTrash />
//                             </a>
//                           </div>
//                         </td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//               </table>
//             </div>

//             <div className="d-flex justify-content-between align-items-center mb-3">
//               <div>Page {page} of {totalPages}</div>
//               <div className="btn-group">
//                 <button className="btn btn-sm btn-outline-secondary" onClick={() => handlePageChange(page - 1)} disabled={page === 1}>Prev</button>
//                 <button className="btn btn-sm btn-outline-secondary" onClick={() => handlePageChange(page + 1)} disabled={page === totalPages}>Next</button>
//               </div>
//             </div>
//           </div>
//         </div>

//         <AddPurchaseModal />
//         <EditPurchaseModal editData={selectedPurchase} onUpdate={fetchPurchases} />
//       </div>
//     </div>
//   );
// };

// export default PurchaseOrder;

// ------------------------------------

import React, { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../../../../pages/config/config";
import { useSettings } from "../../../../Context/purchase/PurchaseContext";
import "../../../../styles/product/product.css";
import { FaFileExcel, FaFilePdf } from "react-icons/fa";
import { CiCirclePlus } from "react-icons/ci";
import AddPurchaseModal from "../../../../pages/Modal/PurchaseModals/AddPurchaseModal";
import EditPurchaseModal from "../../../../pages/Modal/PurchaseModals/EditPurchaseModal";
import { TbEdit, TbTrash } from "react-icons/tb";
import DeleteAlert from "../../../../utils/sweetAlert/DeleteAlert";
import Swal from "sweetalert2";

const PurchaseOrder = () => {

  const [purchases, setPurchases] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    startDate: "",
    endDate: "",
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { settings } = useSettings();

  const fetchPurchases = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/purchases`, {
        params: {
          ...filters,
          status: "Ordered",   // force only pending
          page,
          limit: 10,
        },
      });
      setPurchases(res.data.purchases);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error("Error fetching purchases:", error);
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, [filters, page]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const convertCurrency = (value) => {
    if (!settings.conversionRates || !settings.baseCurrency) return value?.toFixed(2) || "0.00";
    const baseToSelectedRate = settings.conversionRates[settings.currencyCode] || 1;
    const baseToBaseRate = settings.conversionRates[settings.baseCurrency] || 1;
    const converted = (value / baseToBaseRate) * baseToSelectedRate;
    return converted.toFixed(2);
  };

  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const handleEditClick = (purchase) => {
    setSelectedPurchase(purchase);
    const editModal = new window.bootstrap.Modal(document.getElementById("edit-purchase"));
    editModal.show();
  };

  const handleDeletePurchase = async (id, referenceNumber) => {
    const confirmed = await DeleteAlert({});
    if (!confirmed) return;

    try {
      await axios.delete(`${BASE_URL}/api/purchases/${id}`);
      fetchPurchases(); // Refresh the table
      // toast.success("purchases Deleted successfully!");
      Swal.fire(
        "Deleted!",
        `purchases "${referenceNumber}" has been deleted.`,
        "success"
      );
    } catch (error) {
      console.error("Failed to delete purchase:", error);
      // alert("Error deleting purchase. Please try again.");
    }
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="add-item d-flex">
            <div className="page-title">
              <h4 className="fw-bold">Purchase order</h4>
              <h6>Manage your Purchase order</h6>
            </div>
          </div>
          <div className="table-top-head me-2">
            <li><button type="button" className="icon-btn" title="Pdf"><FaFilePdf /></button></li>
            <li><label className="icon-btn m-0" title="Import Excel"><input type="file" accept=".xlsx, .xls" hidden /><FaFileExcel style={{ color: "green" }} /></label></li>
            <li><button type="button" className="icon-btn" title="Export Excel"><FaFileExcel /></button></li>
          </div>
        </div>
        {/* /product list */}
        <div className="card">
          <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
            <div className="search-set">
              <div className="search-input">
                <span className="btn-searchset"><i className="ti ti-search fs-14 feather-search" /></span>
              </div>
            </div>
            <div className="d-flex table-dropdown my-xl-auto right-content align-items-center flex-wrap row-gap-3">
              <div className="dropdown">
                <a href="javascript:void(0);" className="dropdown-toggle btn btn-white btn-md d-inline-flex align-items-center" data-bs-toggle="dropdown">
                  Sort By : Last 7 Days
                </a>
                <ul className="dropdown-menu  dropdown-menu-end p-3">
                  <li>
                    <a href="javascript:void(0);" className="dropdown-item rounded-1">Recently Added</a>
                  </li>
                  <li>
                    <a href="javascript:void(0);" className="dropdown-item rounded-1">Ascending</a>
                  </li>
                  <li>
                    <a href="javascript:void(0);" className="dropdown-item rounded-1">Desending</a>
                  </li>
                  <li>
                    <a href="javascript:void(0);" className="dropdown-item rounded-1">Last Month</a>
                  </li>
                  <li>
                    <a href="javascript:void(0);" className="dropdown-item rounded-1">Last 7 Days</a>
                  </li>
                </ul>
              </div>
            </div>
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
                    <th>Supplier</th>
                    <th>Reference</th>
                    <th>Date</th>
                    <th>Product</th>
                    <th>Status</th>
                    <th>Purchased Amount</th>
                    <th>Purchased QTY</th>
                    <th>Payment Status</th>
                    <th>Paid</th>
                    <th>Due</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>

                  {purchases.length === 0 ? (
                    <tr><td colSpan="12" className="text-center">No purchase orders found.</td></tr>
                  ) : (
                    purchases.map((purchase) => (
                      <tr>
                        <td>
                          <label className="checkboxs">
                            <input type="checkbox" />
                            <span className="checkmarks" />
                          </label>
                        </td>

                        <td>{purchase.supplier ? `${purchase.supplier.firstName} ${purchase.supplier.lastName}` : "N/A"}</td>
                        <td>{purchase.referenceNumber}</td>
                        <td>{new Date(purchase.purchaseDate).toLocaleDateString()}</td>

                        <td className=" ">
                          <div className="d-flex flex-column ">
                            {purchase.products.map((p, idx) => (
                              <div key={idx} className="d-flex align-items-center ">
                                {p.product?.images?.[0]?.url && (
                                  <img
                                    src={p.product.images[0].url}
                                    alt={p.product.productName}
                                    className="media-image me-2"
                                    style={{ height: "40px", width: "40px", objectFit: "cover", borderRadius: "8px" }}
                                  />
                                )}
                                <span>{p.product?.productName || "Unnamed Product"}</span>
                              </div>
                            ))}
                          </div>
                        </td>
                        <td><span className="badge bg-warning">{purchase.status}</span></td>
                        <td>
                          <ul className="list-unstyled mb-0">
                            {purchase.products.map((p, idx) => (
                              <li key={idx}>
                                {settings.currencySymbol}{p.purchasePrice?.toFixed(2) || "0.00"}
                              </li>
                            ))}
                          </ul>
                        </td>
                        <td>
                          <ul className="list-unstyled mb-0">
                            {purchase.products.map((p, idx) => (
                              <li key={idx}>
                                {p.quantity || 0} {p.unit || ""}
                              </li>
                            ))}
                          </ul>
                        </td>
                        <td>

                          <span className={`badge ${purchase.payment?.paymentStatus === 'Paid' ? 'bg-success' : 'bg-danger'}`}>
                            {purchase.payment?.paymentStatus || 'Unpaid'}
                          </span>
                        </td>
                        <td>   {settings.currencySymbol} {purchase.payment?.paidAmount || '0.00'}</td>
                        <td>   {settings.currencySymbol} {purchase.payment?.dueAmount || '0.00'}</td>
                        <td className="action-table-data">
                          <div className="edit-delete-action">
                            <a className="me-2 p-2" data-bs-toggle="modal" data-bs-target="#edit-purchase" onClick={() => handleEditClick(purchase)}><TbEdit /></a>
                            {/* <a className="p-2"><TbTrash /></a> */}
                            <a className="p-2 text-danger" onClick={() => handleDeletePurchase(purchase._id, purchase.referenceNumber)} title="Delete Purchase">
                              <TbTrash />
                            </a>
                          </div>
                        </td>


                      </tr>
                      // <tr key={purchase._id}>
                      //   <td><label className="checkboxs"><input type="checkbox" /><span className="checkmarks" /></label></td>
                      //   <td>{purchase.supplier ? `${purchase.supplier.firstName} ${purchase.supplier.lastName}` : "N/A"}</td>
                      //   <td>{purchase.referenceNumber}</td>
                      //   <td>{new Date(purchase.purchaseDate).toLocaleDateString()}</td>
                      //   <td>
                      //     <ul>{purchase.products.map((p, idx) => (<li key={idx}>{p.product?.productName} - {p.quantity} × {settings.currencySymbol}{convertCurrency(p.purchasePrice)}</li>))}</ul>
                      //   </td>
                      //   <td><ul>{purchase.products.map((p, idx) => (<li key={idx}>{p.quantity} {p.unit}</li>))}</ul></td>
                      //   <td><ul>{purchase.products.map((p, idx) => (<li key={idx}>{settings.currencySymbol}{convertCurrency(p.purchasePrice)}</li>))}</ul></td>
                      //   <td><ul>{purchase.products.map((p, idx) => (<li key={idx}>{settings.currencySymbol}{convertCurrency(p.discount)}</li>))}</ul></td>
                      //   <td><ul>{purchase.products.map((p, idx) => (<li key={idx}>{p.tax} %</li>))}</ul></td>
                      //   <td><ul>{purchase.products.map((p, idx) => (<li key={idx}>{settings.currencySymbol}{convertCurrency(p.taxAmount || ((p.afterDiscount * p.tax) / 100 || 0))}</li>))}</ul></td>
                      //   <td>{settings.currencySymbol}{convertCurrency(purchase.shippingCost)}</td>
                      //   <td>{settings.currencySymbol}{convertCurrency(purchase.orderTax)}</td>
                      //   <td><ul>{purchase.products.map((p, idx) => (<li key={idx}>{settings.currencySymbol}{convertCurrency(p.unitCost)}</li>))}</ul></td>
                      //   <td><ul>{purchase.products.map((p, idx) => (<li key={idx}>{settings.currencySymbol}{convertCurrency(p.totalCost)}</li>))}</ul></td>
                      //   <td><span className="badge bg-warning">{purchase.status}</span></td>
                      //   <td className="action-table-data">
                      //     <div className="edit-delete-action">
                      //       <a className="me-2 p-2" data-bs-toggle="modal" data-bs-target="#edit-purchase" onClick={() => handleEditClick(purchase)}><TbEdit /></a>
                      //       {/* <a className="p-2"><TbTrash /></a> */}
                      //       <a className="p-2 text-danger" onClick={() => handleDeletePurchase(purchase._id, purchase.referenceNumber)} title="Delete Purchase">
                      //         <TbTrash />
                      //       </a>
                      //     </div>
                      //   </td>
                      // </tr>

                    ))
                  )}


                </tbody>
              </table>
            </div>
            <div className="d-flex justify-content-between align-items-center p-2 mb-0">
              <div className="">Page {page} of {totalPages}</div>
              <div className="btn-group">
                <button className="btn btn-sm btn-outline-secondary" onClick={() => handlePageChange(page - 1)} disabled={page === 1}>Prev</button>
                <button className="btn btn-sm btn-outline-secondary" onClick={() => handlePageChange(page + 1)} disabled={page === totalPages}>Next</button>
              </div>
            </div>
          </div>
        </div>
        {/* /product list */}
        <EditPurchaseModal editData={selectedPurchase} onUpdate={fetchPurchases} />
      </div>

    </div>

  )
}

export default PurchaseOrder


// ------------------------------------
// import React from "react";

// const Purchase = () => {
//   return (
//     <div className="page-wrapper">
//       <div className="content">
//         <div className="page-header transfer d-flex justify-content-between align-items-start flex-wrap gap-3">
//           <div>
//             <h4 className="fw-bold">Purchase</h4>
//             <h6>Manage your purchases</h6>
//           </div>
//           <ul className="table-top-head d-flex gap-2">
//             {["pdf", "excel"].map((icon) => (
//               <li key={icon}>
//                 <a data-bs-toggle="tooltip" title={icon.toUpperCase()}>
//                   <img src={`assets/img/icons/${icon}.svg`} alt={icon} />
//                 </a>
//               </li>
//             ))}
//             <li>
//               <a data-bs-toggle="tooltip" title="Refresh">
//                 <i data-feather="rotate-ccw" />
//               </a>
//             </li>
//             <li>
//               <a data-bs-toggle="tooltip" title="Collapse">
//                 <i className="ti ti-chevron-up" />
//               </a>
//             </li>
//           </ul>
//           <div className="d-flex gap-2">
//             <a className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#add-purchase">
//               <i data-feather="plus-circle" className="me-1" />
//               Add Purchase
//             </a>
//             <a className="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#view-notes">
//               <i data-feather="download" className="me-2" />
//               Import Purchase
//             </a>
//           </div>
//         </div>

//         <div className="card">
//           <div className="card-header d-flex justify-content-between flex-wrap gap-3">
//             <div className="search-input">
//               <span className="btn-searchset">
//                 <i className="ti ti-search fs-14" />
//               </span>
//             </div>
//             <div className="dropdown">
//               <a className="btn btn-white dropdown-toggle" data-bs-toggle="dropdown">
//                 Payment Status
//               </a>
//               <ul className="dropdown-menu dropdown-menu-end p-3">
//                 {["Paid", "Unpaid", "Overdue"].map((status) => (
//                   <li key={status}>
//                     <a className="dropdown-item rounded-1" href="#">
//                       {status}
//                     </a>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           </div>

//           <div className="card-body p-0">
//             <div className="table-responsive">
//               <table className="table datatable">
//                 <thead className="thead-light">
//                   <tr>
//                     <th>
//                       <label className="checkboxs">
//                         <input type="checkbox" />
//                         <span className="checkmarks" />
//                       </label>
//                     </th>
//                     <th>Supplier Name</th>
//                     <th>Reference</th>
//                     <th>Date</th>
//                     <th>Status</th>
//                     <th>Total</th>
//                     <th>Paid</th>
//                     <th>Due</th>
//                     <th>Payment Status</th>
//                     <th />
//                   </tr>
//                 </thead>
//                 <tbody>
//                   <tr>
//                     <td>
//                       <label className="checkboxs">
//                         <input type="checkbox" />
//                         <span className="checkmarks" />
//                       </label>
//                     </td>
//                     <td>Electro Mart</td>
//                     <td>PT001</td>
//                     <td>24 Dec 2024</td>
//                     <td>
//                       <span className="badges status-badge fs-10 p-1 px-2 rounded-1">Received</span>
//                     </td>
//                     <td>$1000</td>
//                     <td>$1000</td>
//                     <td>$0.00</td>
//                     <td>
//                       <span className="p-1 pe-2 rounded-1 text-success bg-success-transparent fs-10">
//                         <i className="ti ti-point-filled me-1 fs-11" /> Paid
//                       </span>
//                     </td>
//                     <td className="action-table-data">
//                       <div className="edit-delete-action d-flex gap-2">
//                         <a href="#"><i data-feather="eye" /></a>
//                         <a data-bs-toggle="modal" data-bs-target="#edit-purchase">
//                           <i data-feather="edit" />
//                         </a>
//                         <a data-bs-toggle="modal" data-bs-target="#delete-modal">
//                           <i data-feather="trash-2" />
//                         </a>
//                       </div>
//                     </td>
//                   </tr>
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Purchase;
