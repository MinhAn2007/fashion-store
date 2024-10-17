import "./App.css";
import { useState } from "react";
import NavBar from "./components/NavBar";
import Body from "./components/Body";
import SimpleSlider from "./components/HeroCarousel";
import HeroSection from "./components/HeroSection";
import OurBestSellers from "./components/OurBestSellers";
import Ingridients from "./components/Ingridients";
import JournalSection from "./components/JournalSection";
import BsText from "./components/BsText";
import { Route, Routes } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
import SinglePage from "./components/SinglePage";
import JournalPage from "./components/JournalPage";
import Cart from "./components/Cart";
import FollowONIG from "./components/FollowONIG";
import Products from "./components/Products";
import CartHold from "./components/CartHold";
import SPFooter from "./components/SPFooter";
import Under20 from "./components/Under20";
import Under10 from "./components/Under10";
import ForHer from "./components/ForHer";
import ForHim from "./components/ForHim";
import MobileNav from "./components/MobileNav";
import Chatbot from "./components/ChatBot";
import ScrollToTop from "./components/ScrollOnTop";
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route
            path="/"
            exact
            element={
              <>
                {" "}
                <SimpleSlider /> <HeroSection /> <BsText /> {<Products />}{" "}
                {/*<OurBestSellers />*/} <Ingridients /> <JournalSection />{" "}
                <FollowONIG /> <SPFooter />{" "}
              </>
            }
          />
          <Route
            path="/:id"
            exact
            element={
              <>
                {" "}
                <SinglePage /> <SPFooter />
              </>
            }
          />
          <Route
            path="/journal/april"
            element={
              <>
                {" "}
                <JournalPage /> <SPFooter />
              </>
            }
          />
          <Route
            path="/cart"
            exact
            element={
              <>
                {" "}
                <CartHold />
              </>
            }
          />
          <Route
            path="/under20"
            element={
              <>
                {" "}
                <Under20 />{" "}
              </>
            }
          />
          <Route
            path="/under40"
            element={
              <>
                {" "}
                <Under10 />{" "}
              </>
            }
          />
          <Route
            path="/forher"
            element={
              <>
                {" "}
                <ForHer />{" "}
              </>
            }
          />
          <Route
            path="/forhim"
            element={
              <>
                {" "}
                <ForHim />{" "}
              </>
            }
          />
        </Routes>
        <ScrollToTop />
      </BrowserRouter>
      <Chatbot />
    </div>
  );
}

export default App;
