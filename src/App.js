import "./App.css";
import NavBar from "./components/NavBar";
import SimpleSlider from "./components/HeroCarousel";
import HeroSection from "./components/HeroSection";
import Ingridients from "./components/Ingridients";
import JournalSection from "./components/JournalSection";
import BsText from "./components/BsText";
import { Route, Routes } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
import SinglePage from "./components/SinglePage";
import JournalPage from "./components/JournalPage";
import FollowONIG from "./components/FollowONIG";
import Products from "./components/Products";
import CartHold from "./components/CartHold";
import SPFooter from "./components/SPFooter";
import ProductFeed from "./components/ListProducts";
import Chatbot from "./components/ChatBot";
import ScrollToTop from "./components/ScrollOnTop";
import Login from "./components/Login";
import SignUp from "./components/SignUp";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          <Route
            path="/"
            element={
              <>
                <NavBar />
                <SimpleSlider />
                <HeroSection />
                <BsText />
                <Products />
                <Ingridients />
                <JournalSection />
                <FollowONIG />
                <SPFooter />
              </>
            }
          />
          <Route
            path="/:id"
            element={
              <>
                <NavBar />
                <SinglePage />
                <SPFooter />
              </>
            }
          />
          <Route
            path="/journal/april"
            element={
              <>
                <NavBar />
                <JournalPage />
                <SPFooter />
              </>
            }
          />
          <Route
            path="/cart"
            element={
              <>
                <NavBar />
                <CartHold />
                <SPFooter />
              </>
            }
          />
          <Route
            path="/products"
            element={
              <>
                <NavBar />
                <ProductFeed />
                <SPFooter />
              </>
            }
          />
          <Route
            path="/ao"
            element={
              <>
                <NavBar />
                <ProductFeed id={1} />
                <SPFooter />
              </>
            }
          />
          <Route
            path="/quan"
            element={
              <>
                <NavBar />
                <ProductFeed id={2} />
                <SPFooter />
              </>
            }
          />
          <Route
            path="/phukien"
            element={
              <>
                <NavBar />
                <ProductFeed id={3} />
                <SPFooter />
              </>
            }
          />
          <Route
            path="/giay"
            element={
              <>
                <NavBar />
                <ProductFeed id={4} />
                <SPFooter />
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