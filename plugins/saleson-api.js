import CouponApi from '@/modules/api/CouponApi'
import InquiryApi from "@/modules/api/InquiryApi";
import PointApi from "@/modules/api/PointApi";
import WishlistApi from "@/modules/api/WishlistApi";
import ItemApi from "@/modules/api/ItemApi";
import ReportApi from "@/modules/api/ReportApi";
import CartApi from "@/modules/api/CartApi";
import ExperienceApi from "@/modules/api/ExperienceApi";
import OrderApi from "@/modules/api/OrderApi";
import CommonApi from "@/modules/api/CommonApi";
import MypageApi from "@/modules/api/MypageApi";
import SellerApi from "@/modules/api/SellerApi";
import StatisticsApi from "@/modules/api/StatisticsApi";
import SearchApi from "@/modules/api/SearchApi";
import OutletApi from "@/modules/api/OutletApi";
import EventApi from "@/modules/api/EventApi";
import DisplayApi from "@/modules/api/DisplayApi";
import BrandApi from "@/modules/api/BrandApi";
import PopupApi from "@/modules/api/PopupApi";
import ReviewApi from "@/modules/api/ReviewApi";
import BusinessConversionApi from "@/modules/api/BusinessConversion";
import AppPushApi from "@/modules/api/AppPushApi";
import AppVersionApi from "@/modules/api/AppVersionApi";
import PolicyApi from "@/modules/api/PolicyApi";
import AuthApi from "@/modules/api/AuthApi";

export default (context, inject) => {
    inject('salesonApi', () => {
        return {
            'coupon': new CouponApi(context),
            'inquiry': new InquiryApi(context),
            'point': new PointApi(context),
            'wishlist': new WishlistApi(context),
            'item': new ItemApi(context),
            'cart': new CartApi(context),
            'report': new ReportApi(context),
            'order': new OrderApi(context),
            'mypage': new MypageApi(context),
            'common': new CommonApi(context),
            'seller': new SellerApi(context),
            "statistics": new StatisticsApi(context),
            'search': new SearchApi(context),
            'outlet': new OutletApi(context),
            'experience': new ExperienceApi(context),
            'event': new EventApi(context),
            'display': new DisplayApi(context),
            'brand': new BrandApi(context),
            'popup': new PopupApi(context),
            'review': new ReviewApi(context),
            'businessConversion': new BusinessConversionApi(context),
            'appPush': new AppPushApi(context),
            'appVersion': new AppVersionApi(context),
            'policy': new PolicyApi(context),
            'auth': new AuthApi(context),
        }
    })
}