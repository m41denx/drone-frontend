import '@/styles/globals.css'
import {ConfigProvider, theme} from "antd";
import {useCookies} from "react-cookie";
import AuthModal from "@/components/AuthModal";
import {useRouter} from "next/router";

export default function App({ Component, pageProps }) {

    const router = useRouter()

    const [cookies, setCookie, delCookies] = useCookies(['jwt', 'market_jwt']);
    let isAuth = !!cookies.jwt



  return  <ConfigProvider
      theme={{
          algorithm: theme.darkAlgorithm,
          token: {
            colorPrimary: '#1677FF',
            borderRadius: 6,
          },
          components: {
              Table: {
                  headerBg: "rgba(0,0,0,0)",
                  footerBg: "rgba(0,0,0,0)",
                  colorBgContainer: "rgba(0,0,0,0)",
                  fontSize: 16,
                  selectionColumnWidth: 48
              },
              Tag: {
                  fontSize: 14,
                  fontSizeSM: 14
              },
              Modal: {
                  headerBg: "transparent",
              },
              Input: {
                  paddingInline: 4
              }
          }
      }}>
      {Component.auth?(
          isAuth?(
              <Component {...pageProps} />
          ): (
              <AuthModal setCookie={setCookie} url={router.pathname} />
          )
      ):<Component {...pageProps} />}
  </ConfigProvider>
}
