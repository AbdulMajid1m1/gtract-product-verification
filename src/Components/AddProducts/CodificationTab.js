import React, { useContext, useState } from 'react';
import { FaAngleRight, FaAngleDown } from 'react-icons/fa';
import gtrackIcon from "../../Images/gtrackicons.png"
import axios from 'axios';
import { SnackbarContext } from '../../Contexts/SnackbarContext';

const CodificationTab = () => {
  const [open, setOpen] = useState(false);
  const [subOpen, setSubOpen] = useState(false);
  const [thirdOpen, setThirdOpen] = useState(false);
  const [fourthOpen, setFourthOpen] = useState(false);
  const [fifthOpen, setFifthOpen] = useState(false);
  const [sixthOpen, setSixthOpen] = useState(false);
  const [hsCode, setHsCode] = useState('');
  const { openSnackbar } = useContext(SnackbarContext);


  const toggleOpen = () => {
    setOpen(!open);
  };

  const toggleSubOpen = (e) => {
    e.stopPropagation(); // Prevent parent from closing when a sub-item is clicked
    setSubOpen(!subOpen);
  };

  const toggleThirdOpen = (e) => {
    e.stopPropagation(); // Prevent parent from closing when a sub-item is clicked
    setThirdOpen(!thirdOpen);
  };

    const toggleFourthOpen = (e) => {
    e.stopPropagation(); // Prevent parent from closing when a sub-item is clicked
    setFourthOpen(!fourthOpen);
    }

    const toggleFifthOpen = (e) => {
    e.stopPropagation(); // Prevent parent from closing when a sub-item is clicked
    setFifthOpen(!fifthOpen);
    }

    const toggleSixthOpen = (e) => {
    e.stopPropagation(); // Prevent parent from closing when a sub-item is clicked
    setSixthOpen(!sixthOpen);
    }

    // get the product session data
    const gtinData = JSON.parse(sessionStorage.getItem("productData"));
    console.log(gtinData);

    const [selectedOption, setSelectedOption] = useState("GS1-GPC");

  //Second Tab
  const handleOptionChange = (option) => {
    setSelectedOption(option);

    switch (option) {
      case "GS1-GPC":
        // newRequest
        //   .get(`/getSafetyInformationByGtin/${gtinData?.gtin}`)
        //   .then((response) => {
        //     console.log(response.data);
        //     setSafetyInformation(response.data);
        //   })
        //   .catch((err) => {
        //     console.log(err);
        //     openSnackbar(
        //       err?.response?.data?.message ?? "something went wrong!",
        //       "error"
        //     );
        //     setSafetyInformation([]);
        //   });
        break;

      case "HS-CODES":
          axios.post('https://gs1ksa.org/api/find/hscode', {
            // "hscode": gtinData
            "hscode": "0204 42"
          })
          .then((response) => {
            console.log(response?.data)
            setHsCode(response?.data)
          })
          .catch((error) => {
            console.log(error);
            openSnackbar(
              error?.response?.data?.message ?? "something went wrong!",
              "error"
            );
          })
        break;

      case "UNSPSC":
        break;

      case "OTHER":
        break;

      // Add more cases for other options
      default:
        break;
    }
  };


  const renderDataGrid = () => {
    switch (selectedOption) {
      case "GS1-GPC":
        return (
          <div>
              <ul>
                <li>
                  <a
                    href="#"
                    onClick={toggleOpen}
                    className={`flex items-center px-4 hover:bg-secondary-100 focus:text-primary active:text-primary ${open ? 'text-primary' : ''}`}
                  >
                    {open ? (
                      <FaAngleDown />
                    ) : (
                      <FaAngleRight />
                    )}
                    Segment 73000000 Kitchenware and Tableware
                  </a>
                  <ul className={`ml-6 ${open ? 'block' : 'hidden'}`}>
                    <li className="px-2 hover:bg-secondary-100">Second-one</li>
                    <li className="px-2 hover:bg-secondary-100">Second-two</li>
                    <li>
                      <a
                        href="#"
                        onClick={toggleSubOpen}
                        className={`flex items-center px-2 hover:bg-secondary-100 focus:text-primary active:text-primary ${subOpen ? 'text-primary' : ''}`}
                      >
                        {subOpen ? (
                          <FaAngleDown />
                        ) : (
                          <FaAngleRight />
                        )}
                        Family 73050000 Tableware
                      </a>
                      <ul className={`ml-6 ${subOpen ? 'block' : 'hidden'}`}>
                        <li>
                          <a
                            href="#"
                            onClick={toggleThirdOpen}
                            className={`flex items-center px-4 hover:bg-secondary-100 focus:text-primary active:text-primary ${thirdOpen ? 'text-primary' : ''}`}
                          >
                            {thirdOpen ? (
                              <FaAngleDown />
                            ) : (
                              <FaAngleRight />
                            )}
                            Class 73050000 Tableware (Disposable)
                          </a>
                          <ul className={`ml-10 ${thirdOpen ? 'block' : 'hidden'}`}>
                            <li className="px-2 hover:bg-secondary-100">Fourth-one</li>
                            <li className="px-2 hover:bg-secondary-100">Fourth-two</li>
                            <li className="px-2 hover:bg-secondary-100">Fourth-three</li>
                          </ul>
                        </li>
                        <li>
                          <a
                            href="#"
                            onClick={toggleFourthOpen}
                            className={`flex items-center px-10 hover:bg-secondary-100 focus:text-primary active:text-primary ${thirdOpen ? 'text-primary' : ''}`}
                          >
                            {fourthOpen ? (
                              <FaAngleDown />
                            ) : (
                              <FaAngleRight />
                            )}
                            Brick 10007262 Flatware (Disposable)
                          </a>
                          <ul className={`ml-16 ${fourthOpen ? 'block' : 'hidden'}`}>
                            <li className="px-2 hover:bg-secondary-100">Fourth-one</li>
                            <li className="px-2 hover:bg-secondary-100">Fourth-two</li>
                            <li className="px-2 hover:bg-secondary-100">Fourth-three</li>
                          </ul>
                        </li>
                        <li>
                          <a
                            href="#"
                            onClick={toggleFifthOpen}
                            className={`flex items-center px-14 hover:bg-secondary-100 focus:text-primary active:text-primary ${thirdOpen ? 'text-primary' : ''}`}
                          >
                            {fifthOpen ? (
                              <FaAngleDown />
                            ) : (
                              <FaAngleRight />
                            )}
                                Attribute 10007262 Flatware Types of Disposable Flatware
                          </a>
                          <ul className={`ml-20 ${fifthOpen ? 'block' : 'hidden'}`}>
                            <li className="px-2 hover:bg-secondary-100">Fourth-one</li>
                            <li className="px-2 hover:bg-secondary-100">Fourth-two</li>
                            <li className="px-2 hover:bg-secondary-100">Fourth-three</li>
                          </ul>
                        </li>
                        <li>
                          <a
                            href="#"
                            onClick={toggleSixthOpen}
                            className={`flex items-center px-20 hover:bg-secondary-100 focus:text-primary active:text-primary ${thirdOpen ? 'text-primary' : ''}`}
                          >
                            {sixthOpen ? (
                              <FaAngleDown />
                            ) : (
                              <FaAngleRight />
                            )}
                                Attribute value 30011729 SPOON (DISPOSABLE)
                          </a>
                          <ul className={`ml-24 ${sixthOpen ? 'block' : 'hidden'}`}>
                            <li className="px-2 hover:bg-secondary-100">Fourth-one</li>
                            <li className="px-2 hover:bg-secondary-100">Fourth-two</li>
                            <li className="px-2 hover:bg-secondary-100">Fourth-three</li>
                          </ul>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </li>
              </ul>
          </div>
        );

      case "HS-CODES":
        return (
          <div className='h-auto w-full mt-3 px-2'>
              <h1>{hsCode?.gpc?.code}</h1>
              <h1>{hsCode?.gpc?.name}</h1>
              <h1>{hsCode?.gpc?.title}</h1>
          </div>
        );
    }     
  }

  return (
       <div className='flex justify-between gap-2 w-full'>
          <div className='w-[20%] flex flex-col gap-2 mt-2'>
                <span
                  className={`bg-[#3b5998] py-2 flex justify-start px-1 rounded-md text-white items-center gap-2 cursor-pointer 
                            }`}
                  onClick={() => handleOptionChange("GS1-GPC")}
                >
                  <img
                    src={gtrackIcon}
                    className="w-5 h-5 ml-1"
                    alt=""
                  />
                  GS1 GPC
                </span>
                <span
                  className={`bg-[#00acee] py-2 flex justify-start px-1 rounded-md text-white items-center gap-2 cursor-pointer ${selectedOption === "HS-CODES" ? "bg-yellow-500" : ""
                    }`}
                  onClick={() => handleOptionChange("HS-CODES")}
                >
                  <img
                    src={gtrackIcon}
                    className="w-5 h-5 ml-1"
                    alt=""
                  />
                  HS CODES
                </span>
                <span
                  className={`bg-[#0072b1] py-2 flex justify-start px-1 rounded-md text-white items-center gap-2 cursor-pointer ${selectedOption === "UNSPSC" ? "bg-yellow-500" : ""
                    }`}
                  onClick={() => handleOptionChange("UNSPSC")}
                >
                  <img src={gtrackIcon} className="w-5 h-5 ml-1" alt="" />
                  UNSPSC
                </span>
                <span
                  className={`bg-[#E60023] py-2 flex justify-start px-1 rounded-md text-white items-center gap-2 cursor-pointer ${selectedOption === "OTHER"
                    ? "bg-yellow-500"
                    : ""
                    }`}
                  onClick={() => handleOptionChange("OTHER")}
                >
                  <img
                    src={gtrackIcon}
                    className="w-5 h-5 ml-1"
                    alt=""
                  />
                  OTHER
                </span>
          </div>
         
            <div className="sm:w-[80%] w-full">{renderDataGrid()}</div>
    </div>
  );
};

export default CodificationTab;
