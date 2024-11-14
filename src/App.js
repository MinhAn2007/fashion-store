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
import Profile from "./components/Profile";
import CreateOrder from "./components/CreateOrder";
import ResultVNPAYPage from "./components/VNPayResult";
import OrderList from "./components/OrderList";
import OrderHistory from "./components/OrderHistory";
import ProductReview from "./components/ReviewOrder";
import SaleProductsPage from "./components/SaleProduct";
import NewProductsPage from "./components/NewProducts";
import EditProfile from "./components/EditProfile";
import MinimumStyle from "./components/MinimumStyle";
import SilverAccessories from "./components/SilverAccessories";
import ForgotPassword from "./components/ForgotPassword";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

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
            path="/account"
            element={
              <>
                <NavBar />
                <Profile />
                <SPFooter />
              </>
            }
          />

          {/* Route cho trang chỉnh sửa thông tin */}
          <Route
            path="/edit-profile"
            element={
              <>
                <NavBar />
                <EditProfile />
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
          <Route
            path="/ao-khoac"
            element={
              <>
                <NavBar />
                <ProductFeed id={5} />
                <SPFooter />
              </>
            }
          />
          <Route
            path="/ao-thun"
            element={
              <>
                <NavBar />
                <ProductFeed id={7} />
                <SPFooter />
              </>
            }
          />
          <Route
            path="/ao-somi"
            element={
              <>
                <NavBar />
                <ProductFeed id={11} />
                <SPFooter />
              </>
            }
          />
          <Route
            path="/polo"
            element={
              <>
                <NavBar />
                <ProductFeed id={12} />
                <SPFooter />
              </>
            }
          />
          <Route
            path="/quan-vai"
            element={
              <>
                <NavBar />
                <ProductFeed id={13} />
                <SPFooter />
              </>
            }
          />
          <Route
            path="/quan-tay"
            element={
              <>
                <NavBar />
                <ProductFeed id={14} />
                <SPFooter />
              </>
            }
          />

          <Route
            path="/quan-jean"
            element={
              <>
                <NavBar />
                <ProductFeed id={8} />
                <SPFooter />
              </>
            }
          />

          <Route
            path="/chan-vay"
            element={
              <>
                <NavBar />
                <ProductFeed id={15} />
                <SPFooter />
              </>
            }
          />
          <Route
            path="/vong-co"
            element={
              <>
                <NavBar />
                <ProductFeed id={16} />
                <SPFooter />
              </>
            }
          />

          <Route
            path="/lac-tay"
            element={
              <>
                <NavBar />
                <ProductFeed id={17} />
                <SPFooter />
              </>
            }
          />

          <Route
            path="/khuyen-tai"
            element={
              <>
                <NavBar />
                <ProductFeed id={18} />
                <SPFooter />
              </>
            }
          />
          <Route
            path="/giay-cao-got"
            element={
              <>
                <NavBar />
                <ProductFeed id={19} />
                <SPFooter />
              </>
            }
          />
          <Route
            path="/giay-the-thao"
            element={
              <>
                <NavBar />
                <ProductFeed id={20} />
                <SPFooter />
              </>
            }
          />
          <Route
            path="/order"
            component={<CreateOrder />}
            element={
              <>
                <NavBar />
                <CreateOrder />
                <SPFooter />
              </>
            }
          />
          <Route
            path="/vn-pay-result"
            element={
              <>
                <NavBar />
                <ResultVNPAYPage />
                <SPFooter />
              </>
            }
          />
          <Route
            path="/order-list"
            element={
              <>
                <NavBar />
                <OrderList />
                <SPFooter />
              </>
            }
          />
          <Route
            path="/history"
            element={
              <>
                <NavBar />
                <OrderHistory />
                <SPFooter />
              </>
            }
          />
          <Route
            path="/review"
            element={
              <>
                <NavBar />
                <ProductReview />
                <SPFooter />
              </>
            }
          />
          <Route
            path="/sale-199k"
            element={
              <>
                <NavBar />
                <SaleProductsPage />
                <SPFooter />
              </>
            }
          />
          <Route
            path="/new-products"
            element={
              <>
                <NavBar />
                <NewProductsPage />
                <SPFooter />
              </>
            }
          />
          <Route
            path="/minimum-style"
            element={
              <>
                <NavBar />
                <MinimumStyle />
                <SPFooter />
              </>
            }
          />
          <Route
            path="/accessories"
            element={
              <>
                <NavBar />
                <SilverAccessories />
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
