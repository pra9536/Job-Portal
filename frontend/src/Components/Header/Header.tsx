import { Burger, Button, Drawer } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconX } from "@tabler/icons-react";
import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { setupResponseInterceptor } from "../../Interceptor/AxiosInterceptor";
import { getProfile } from "../../Services/ProfileService";
import { setProfile } from "../../Slices/ProfileSlice";
import { setUser } from "../../Slices/UserSlice";
import NavLinks from "./NavLinks";
import NotiMenu from "./NotiMenu";
import ProfileMenu from "./ProfileMenu";

const Header = () => {
    const [opened, { open, close }] = useDisclosure(false);
    const dispatch = useDispatch();
    const user = useSelector((state: any) => state.user);
    const token = useSelector((state: any) => state.jwt);
    const location = useLocation();
    const navigate = useNavigate();

    let filteredLinks = [
        { name: "Find Jobs", url: "find-jobs" },
        { name: "Find Talent", url: "find-talent" },
        { name: "Post Job", url: "post-job/0" },
        { name: "Posted Jobs", url: "posted-jobs/0" },
        { name: "Job History", url: "job-history" }
    ];

    if (user) {
        if (user.accountType === "APPLICANT") {
            filteredLinks = filteredLinks.filter(link => link.url === "find-jobs" || link.url === "job-history");
        } else if (user.accountType === "EMPLOYER") {
            filteredLinks = filteredLinks.filter(link => link.url === "find-talent" || link.url === "post-job/0" || link.url === "posted-jobs/0");
        }
    }
    useEffect(() => {
        setupResponseInterceptor(navigate, dispatch);

    }, [navigate])
    const handleClick = (url: string) => {
        navigate(url)
        close();
    }
    // Hook 1: Restore user session from token
    useEffect(() => {
        if (token && !user) {
            if (localStorage.getItem("token")) {
                const decoded = jwtDecode(localStorage.getItem("token") || "");
                dispatch(setUser({ ...decoded, email: decoded.sub }));
            }
        }
    }, [token]);

    // Hook 2: Fetch profile when profileId is available
    useEffect(() => {
        if (user?.profileId) {
            getProfile(user.profileId).then((res) => {
                dispatch(setProfile(res));
            }).catch((err) => console.log(err));
        }
    }, [user?.profileId]);
    return (location.pathname != "/signup" && location.pathname != "/login") ? <div data-aos="zoom-out" className="w-full bg-mine-shaft-950 px-6 text-white h-20 flex justify-between items-center font-['poppins']">
        <div onClick={() => navigate("/")} className="flex cursor-pointer items-center text-bright-sun-400">
             <img src="/anchor.png" alt="JobNest Logo" className="h-16 w-30 object-contain"/>
            <div className="xs-mx:hidden text-3xl font-semibold">JobNest</div>
        </div>
        <NavLinks />
        <div className="flex gap-3 items-center">

            {user ? <ProfileMenu /> : <Link to="/login" className="text-mine-shaft-200 hover:text-bright-sun-400 "><Button color="brightSun.4" variant="subtle">Login</Button></Link>}
            {/* <div className=" bg-mine-shaft-900 p-1.5 rounded-full">
                <IconSettings stroke={1.5} />
            </div> */}
            {user ? <NotiMenu /> : <></>}
            {

            }
            <Burger className="bs:hidden" opened={opened} onClick={open} aria-label="Toggle navigation" />
            <Drawer size="xs" overlayProps={{ backgroundOpacity: 0.5, blur: 4 }} position="right" opened={opened} onClose={close} closeButtonProps={{
                icon: <IconX size={30} />,
            }} >
                <div className="flex flex-col gap-6 items-center">

                    {
                        filteredLinks.map((link, index) => <div key={index} className=" h-full flex items-center">
                            <div className="hover:text-bright-sun-400 text-xl " key={index} onClick={() => handleClick(link.url)} >{link.name}</div>
                        </div>)
                    }
                </div>
            </Drawer>
        </div>
    </div> : <></>
}
export default Header;