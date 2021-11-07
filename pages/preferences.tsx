import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import Container from "../components/Container";
import Footer from "../components/Footer";
import Library from "../components/Library";
import LibraryNavbar from "../components/LibraryNavbar";
import Navbar from "../components/Navbar";
import { TextField } from "../components/TextField";
import ToggleButton from "../components/ToggleButton";
import * as Yup from "yup";
import { api, verifyToken } from "../utils/api";
import LoadingWheel from "../components/LoadingWheel";

export default function preferences() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [sorting, setSorting] = useState();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [libraryChanged, setLibraryChanged] = useState("A-Z");
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [enabled, setEnabled] = useState(false);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [lapseThreshold, setLapseThreshold] = useState(0);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [numberOfNewCards, setNumberOfNewCards] = useState(0);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const userId = verifyToken();

    api
      .post("users/user-info", {
        id: userId,
      })
      .then((res) => {
        console.log(res.data);

        setLapseThreshold(res.data.lapseThreshold);
        setEnabled(res.data.removeLeeches);
        setNumberOfNewCards(res.data.numberOfNewCards);

        setIsDataLoaded(true);
      });
  }, []);

  function sendToServer() {
    const userId = verifyToken();

    if (lapseThreshold > 99) {
      setLapseThreshold(99);
    }

    if (numberOfNewCards > 99) {
      setNumberOfNewCards(99);
    }

    console.log(lapseThreshold);
    console.log(enabled);
    console.log(numberOfNewCards);

    api.post("users/update-user-info", {
      lapseThreshold: lapseThreshold,
      removeLeeches: enabled,
      numberOfNewCards: numberOfNewCards,
      userId: userId,
    });
  }

  return (
    <div className="flex flex-col space-y-8">
      <div>
        <Navbar />
      </div>

      <div className="flex flex-col min-h-screen mx-8 bg-white shadow-lg rounded-lg items-center">
        {isDataLoaded ? (
          <div>
            <ToggleButton
              enabled={enabled}
              setEnabled={setEnabled}
              textColor={"black"}
              label={"Remover leeches"}
            />
            <div className="flex flex-col justify-center items-center">
              <div className="flex flex-col sm:flex-row justify-center items-center">
                <label className="m-4 font-bold text-black">
                  Limite para leeches
                </label>
                <input
                  name="limit"
                  type="number"
                  className="bg-gray-200 rounded-lg h-4 w-12 py-3 pl-4"
                  min="1"
                  max="99"
                  value={lapseThreshold}
                  onChange={(e: any) => setLapseThreshold(e.target.value)}
                />
              </div>

              <div className="flex flex-col sm:flex-row justify-center items-center">
                <label className="m-4 font-bold text-black">
                  Número de novas cartas diárias
                </label>
                <input
                  name="newCards"
                  type="number"
                  className="bg-gray-200 rounded-lg h-4 w-12 py-3 pl-4"
                  min="0"
                  max="99"
                  value={numberOfNewCards}
                  onChange={(e: any) => setNumberOfNewCards(e.target.value)}
                />
              </div>

              <button
                className="px-8 mt-4 confirmation-button sm:px-16"
                onClick={() => sendToServer()}
              >
                Enviar
              </button>
            </div>
          </div>
        ) : (
          <LoadingWheel />
        )}
      </div>

      <Footer />
    </div>
  );
}
