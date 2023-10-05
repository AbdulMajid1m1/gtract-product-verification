import React, { useEffect, useRef, useState } from "react";
import "./Sidebar.css";
import { useNavigate } from "react-router-dom";
import dashboard from '../../Images/dashboard.png'
import gtrackicons from '../../Images/gtrackicons.png'
import isoicon from '../../Images/isoicon.png'
import gs1logowhite from '../../Images/gs1logowhite.png'
import profile from '../../Images/profile.png'
import shipmentverificationicon from '../../Images/shipmentverificationIcon.png'
import  verifiedproducticon  from "../../Images/verifedproduct.png";
import backarrow from "../../Images/backarrow.png";
import gtinjourney from "../../Images/gtinjourney.png";
import logout from "../../Images/logout.png"

const SideBar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const navigate = useNavigate();

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);



  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [selectedPath, setSelectedPath] = useState('');

  const handleItemClick = (path) => {
    setSelectedItem(path);
    navigate(path);
  };

  const handleContextMenu = (event, path) => {
    event.preventDefault();
    const clickX = event.clientX;
    const clickY = event.clientY;
    setContextMenuPosition({ x: clickX, y: clickY });
    setSelectedPath(path);
    setShowContextMenu(true);
  };

  const handleContextMenuOptionClick = (option) => {
    if (option === 'openNewTab') {
      window.open(selectedPath, '_blank');
    }
    setShowContextMenu(false);
  };

  const [selectedItem, setSelectedItem] = useState(null);
  const handleLogoClick = () => {
    setSelectedItem(null);
    navigate('/dashboard') // Navigate to the "track" component
  };


  return (
    <div>
      <div className="h-10 sm:ml-72 mb-6 bg-primary ">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <button
              data-drawer-target="logo-sidebar"
              data-drawer-toggle="logo-sidebar"
              aria-controls="logo-sidebar"
              type="button"
              className="inline-flex items-center p-2 ml-3 text-sm text-white rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
              onClick={toggleSidebar}
            >
              <span className="sr-only">Open sidebar</span>
              <svg
                className="w-6 h-6"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  clipRule="evenodd"
                  fillRule="evenodd"
                  d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                ></path>
              </svg>
            </button>
            <p className="sm:text-2xl sm:py-0 py-2 sm:px-0 px-3 text-white font-medium">
              Product Verification Portal
            </p>
          </div>
          <div
            className="flex justify-center items-center cursor-pointer mt-1 px-4"
          >
           <div className='flex justify-end items-center px-0 mr-4'>
                  <span onClick={() => navigate(-1)} className='cursor-pointer'
                  >
                  <img src={backarrow}
                    className='h-8 w-8 text-secondary mr-3'
                    style={{ filter: 'invert(1)' }}
                    alt=''
                  />
                </span>
              </div>
            <img
              onClick={() => navigate("/admin-profile")}
              src={
                // currentUser?.user?.image
                //   ? imagePath + currentUser?.user?.image
                //   : memberprofile
                profile
                }
              className="h-7 w-7 bg-white rounded-full"
              alt=""
            />

          </div>
        </div>
      </div>

      <aside
        id="logo-sidebar"
        className={`fixed top-0 left-0 z-40 w-64 sm:w-72 h-screen transition-transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } sm:translate-x-0`}
        aria-label="Sidebar"
        ref={sidebarRef}
      >
        <div className="h-full px-3 py-2 overflow-y-auto bg-primary">
          <div
            className="flex justify-center items-center mb-3 cursor-pointer"
            // onClick={() => navigate("/track")}
            onClick={handleLogoClick}
          >
            <img
              src={gtrackicons}
              className="h-auto w-44 rounded-md "
              alt=""
            />
          </div>
          <hr />

          <div
            className={`main-images-container ${selectedItem === '/dashboard' ? 'selected-item' : ''}`}
            onClick={() => handleItemClick('/dashboard')}
            onContextMenu={(event) =>
              handleContextMenu(event, '/dashboard')
            }

          >
            <img
              src={dashboard}
              className="main-inside-image bg-white rounded-full"
              alt=""
            />
            <p className="sidebar-text">Dashboard</p>
          </div>

          <div
            className={`main-images-container ${selectedItem === '/shipment-verification' ? 'selected-item' : ''}`}
            onClick={() => handleItemClick('/shipment-verification')}
            onContextMenu={(event) =>
              handleContextMenu(event, '/shipment-verification')
            }

          >
            <img
              src={shipmentverificationicon}
              className="main-inside-image bg-white rounded-full"
              alt=""

            />
            <p className="sidebar-text">Shipment Verification</p>
          </div>

          <div
            className={`main-images-container ${selectedItem === '/verified-product' ? 'selected-item' : ''}`}
            onClick={() => handleItemClick('/verified-product')}
            onContextMenu={(event) =>
              handleContextMenu(event, '/verified-product')
            }

          >
            <img
              src={verifiedproducticon}
              className="main-inside-image bg-white rounded-full"
              alt=""
            />
            <p className="sidebar-text">Verified Product</p>
          </div>


          <div
            className={`main-images-container ${selectedItem === '/gtin-journey' ? 'selected-item' : ''}`}
            onClick={() => handleItemClick('/gtin-journey')}
            onContextMenu={(event) =>
              handleContextMenu(event, '/gtin-journey')
            }

          >
            <img
              src={gtinjourney}
              className="main-inside-image bg-white rounded-full"
              alt=""
            />
            <p className="sidebar-text">Gtin Journey</p>
          </div>

          <div className="main-images-container" onClick={() => navigate("/")}>
            <img src={logout} className="main-inside-image bg-white rounded-full" alt="" />
            <p className="sidebar-text">Log-out</p>
          </div>

        </div>

        {/* This two icons  */}
        <div>
          <div className="flex justify-between w-[95%] px-2 absolute bottom-0 bg-primary">
            <div className="main-images-container">
              <img src={isoicon} className="main-inside-image-gs1logo" alt="" />
            </div>

            <div className="main-images-container">
              <a href="https://www.gs1.org.sa" target="_blank" rel="noopener noreferrer">
                <img src={gs1logowhite} className="main-inside-image-gs1logo" alt="" />
              </a>
            </div>
          </div>
        </div>


        {/* Context Menu */}
        {showContextMenu && (
          <div
            className='context-menu'
            style={{ top: contextMenuPosition.y, left: contextMenuPosition.x }}
          >
            <div
              className='context-menu-option'
              onClick={() => handleContextMenuOptionClick('openNewTab')}
            >
              Open in New Tab
            </div>
            <div
              className='context-menu-option'
              onClick={() => handleContextMenuOptionClick('someOption')}
            >
              Close
            </div>
            {/* ...other context menu options... */}
          </div>
        )}

      </aside>
    </div>
  );
};

export default SideBar;
