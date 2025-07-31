import React from "react";
import { FaFileExcel, FaFilePdf } from "react-icons/fa";
import { TbEdit, TbEye, TbPointFilled, TbTrash } from "react-icons/tb";

const Stores = () => {
  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="add-item d-flex">
            <div className="page-title">
              <h4>Stores</h4>
              <h6>Manage your Store</h6>
            </div>
          </div>
          {/* <ul className="table-top-head">
          <li>
            <a data-bs-toggle="tooltip" data-bs-placement="top" title="Pdf"><img src="assets/img/icons/pdf.svg" alt="img" /></a>
          </li>
          <li>
            <a data-bs-toggle="tooltip" data-bs-placement="top" title="Excel"><img src="assets/img/icons/excel.svg" alt="img" /></a>
          </li>
          <li>
            <a data-bs-toggle="tooltip" data-bs-placement="top" title="Print"><i data-feather="printer" className="feather-rotate-ccw" /></a>
          </li>
          <li>
            <a data-bs-toggle="tooltip" data-bs-placement="top" title="Refresh"><i className="ti ti-refresh" /></a>
          </li>
          <li>
            <a data-bs-toggle="tooltip" data-bs-placement="top" title="Collapse" id="collapse-header"><i className="ti ti-chevron-up" /></a>
          </li>
        </ul> */}
          <div className="table-top-head me-2">
            <li>
              <button type="button" className="icon-btn" title="Pdf">
                <FaFilePdf />
              </button>
            </li>
            <li>
              <label className="icon-btn m-0" title="Import Excel">
                <input type="file" accept=".xlsx, .xls" hidden />
                <FaFileExcel style={{ color: "green" }} />
              </label>
            </li>
            <li>
              <button type="button" className="icon-btn" title="Export Excel">
                <FaFileExcel />
              </button>
            </li>
          </div>
          <div className="page-btn">
            <a
              href="#"
              className="btn btn-primary"
              data-bs-toggle="modal"
              data-bs-target="#add-store"
            >
              <i className="ti ti-circle-plus me-1" />
              Add Store
            </a>
          </div>
        </div>
        {/* /product list */}
        <div className="card">
          <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
            <div className="search-set">
              <div className="search-input">
                <span className="btn-searchset">
                  <i className="ti ti-search fs-14 feather-search" />
                </span>
              </div>
            </div>
            <div className="d-flex table-dropdown my-xl-auto right-content align-items-center flex-wrap row-gap-3">
              <div className="dropdown">
                <a
                  href="javascript:void(0);"
                  className="dropdown-toggle btn btn-white btn-md d-inline-flex align-items-center"
                  data-bs-toggle="dropdown"
                >
                  Status
                </a>
                <ul className="dropdown-menu  dropdown-menu-end p-3">
                  <li>
                    <a
                      href="javascript:void(0);"
                      className="dropdown-item rounded-1"
                    >
                      Active
                    </a>
                  </li>
                  <li>
                    <a
                      href="javascript:void(0);"
                      className="dropdown-item rounded-1"
                    >
                      Inactive
                    </a>
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
                    <th>Store</th>
                    <th>User Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Status</th>
                    <th className="no-sort" />
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <label className="checkboxs">
                        <input type="checkbox" />
                        <span className="checkmarks" />
                      </label>
                    </td>
                    <td className="text-gray-9">Electro Mart</td>
                    <td>johnsmith</td>
                    <td>
                      <a
                        href="../../cdn-cgi/l/email-protection.html"
                        className="__cf_email__"
                        data-cfemail="f1949d949285839e9c908385b19489909c819d94df929e9c"
                      >
                        [email&nbsp;protected]
                      </a>
                    </td>
                    <td>+12498345785</td>
                    <td>
                      <span className="badge badge-success d-inline-flex align-items-center badge-xs">
                        <TbPointFilled className="ti ti-point-filled me-1" />
                        Active
                      </span>
                    </td>
                    {/* <td className="action-table-data">
                    <div className="edit-delete-action">
                      <a className="me-2 p-2" href="#">
                        <i data-feather="eye" className="feather-eye" />
                      </a>
                      <a className="me-2 p-2" href="javascript:void(0);" data-bs-toggle="modal" cc">
                        <i data-feather="edit" className="feather-edit" />
                      </a>
                      <a className="p-2" href="javascript:void(0);" data-bs-toggle="modal" data-bs-target="#delete-modal">
                        <i data-feather="trash-2" className="feather-trash-2" />
                      </a>
                    </div>
                  </td> */}
                    <td className="action-table-data">
                      <div className="edit-delete-action">
                        <a className="me-2 p-2">
                          <TbEye />
                        </a>
                        <a
                          className="me-2 p-2"
                          data-bs-toggle="modal"
                          data-bs-target="#edit-store"
                        >
                          <TbEdit />
                        </a>

                        <a className="p-2">
                          <TbTrash />
                        </a>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {/* /product list */}
      </div>
      {/* <!-- Add Store --> */}
      <div className="modal fade" id="add-store">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <div className="page-title">
                <h4>Add Store</h4>
              </div>
              <button
                type="button"
                className="close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <form action="https://dreamspos.dreamstechnologies.com/html/template/store-list.html">
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">
                    Store Name <span className="text-danger">*</span>
                  </label>
                  <input type="text" className="form-control" />
                </div>
                <div className="mb-3">
                  <label className="form-label">
                    User Name <span className="text-danger">*</span>
                  </label>
                  <input type="text" className="form-control" />
                </div>
                <div className="input-blocks mb-3">
                  <label className="form-label">
                    Password <span className="text-danger">*</span>
                  </label>
                  <div className="pass-group">
                    <input
                      type="password"
                      className="form-control pass-input"
                    />
                    <span className="fas toggle-password fa-eye-slash" />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">
                    Email <span className="text-danger">*</span>
                  </label>
                  <input type="email" className="form-control" />
                </div>
                <div className="mb-3">
                  <label className="form-label">
                    Phone <span className="text-danger">*</span>
                  </label>
                  <input type="text" className="form-control" />
                </div>
                <div className="mb-0">
                  <div className="status-toggle modal-status d-flex justify-content-between align-items-center">
                    <span className="status-label ">Status</span>
                    <input
                      type="checkbox"
                      id="user2"
                      className="check"
                      defaultChecked
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
                  Add Store
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* <!-- /Add Store --> */}
    </div>
  );
};

export default Stores;
