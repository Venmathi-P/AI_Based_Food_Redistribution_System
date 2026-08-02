import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function BusinessLayout({children}){

    return(

        <>

            <Sidebar/>

            <div className="main">

                <Navbar/>

                <div className="content">

                    {children}

                </div>

            </div>

        </>

    )

}