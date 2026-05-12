import React, { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  Users,
  BookOpen,
  Briefcase,
  Calendar,
  Clock,
  Wallet,
  Receipt,
  Package,
  Truck,
  KanbanSquare,
  FileText,
  School as SchoolIcon,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Bell,
  Search,
  User as UserIcon,
  Menu as MenuIcon,
  X,
  Settings,
} from "lucide-react";
import { school } from "../mock/data";
import { accessRules, cn } from "../lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { Navigate, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/store";
import {
  useGetauthuserQuery,
  useGetSchoolByIDQuery,
} from "../features/apiSlice";
import { clearUserData, updateUserData } from "../features/user/userSlice";
import { clearToken } from "../features/auth/authSlice";
import { toast } from "react-toastify";


const navItems = [
  { id: "dashboard", label: "Dashboard", icon: BarChart3 },
  { id: "students", label: "Students", icon: Users },
  { id: "grades", label: "Grades", icon: BookOpen },
  { id: "employees", label: "Employees", icon: Briefcase },
  { id: "timetable", label: "Timetable", icon: Calendar },
  // { id: "attendance", label: "Attendance", icon: Clock },
  { id: "payments", label: "Payments", icon: Wallet },
  { id: "expenses", label: "Expenses", icon: Receipt },
  { id: "inventory", label: "Inventory", icon: Package },
  { id: "suppliers", label: "Suppliers", icon: Truck },
  { id: "projects", label: "Projects", icon: KanbanSquare },
  // { id: "reports", label: "Reports", icon: FileText },
    { id: "settings", label: "Settings", icon: Settings },

];

export const Layout = () => {
  const auth = useSelector((state: RootState) => state.auth.value.accessToken);
  const user = useSelector((state: RootState) => state.user.value);

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathName = useLocation().pathname.split("/")[1];
  const [activeTab, setactiveTab] = useState(pathName);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data: schoolData } = useGetSchoolByIDQuery(user?.schoolId as string, {
    skip: user?.schoolId === undefined,
  });
  const school = useMemo(() => schoolData?.data, [schoolData?.data]);
  const { data: authUser } = useGetauthuserQuery();
  useMemo(() => {
    if (authUser?.data) {
      dispatch(updateUserData(authUser?.data));
    }
    return authUser?.data;
  }, [authUser?.data]);

  useEffect(() => {
    setactiveTab(pathName);
  }, [pathName]);
// Filter nav items based on user role
const userRole = user?.role?.toLowerCase() || "";
  const allowedNavItems = useMemo(() => {
    
    const rules = accessRules[userRole]?.access_routes || [];
    
    // If superadmin or rule contains wildcard, show everything
    if (rules.includes("*")) return navItems;

    // Filter items where the ID exists in the access_routes array
    return navItems.filter((item) => rules.includes(item.id));
  }, [userRole]);
  if (!auth) {
    console.log("meme")
    return <Navigate to="/login" replace  />;
  }

  return (
    <div className="min-h-screen bg-bg-base flex text-text-main font-sans h-screen overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside
        className={cn(
          "hidden md:!flex flex-col bg-sidebar-bg transition-all duration-300 ease-in-out h-screen flex-shrink-0",
          collapsed ? "w-20" : "w-[220px]",
        )}
      >
        <div className="py-6 px-5 font-extrabold text-[1.25rem] text-white border-b border-white/10 shrink-0">
          {!collapsed ? "EDUCORE" : "EC"}
        </div>

        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
          {allowedNavItems.map((item) => (
            <NavLink to={item.id} key={item.id}>
              <button
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[0.875rem] transition-all duration-200 group relative",
                  activeTab === item.id
                    ? "bg-sidebar-active text-white font-semibold"
                    : "text-sidebar-text hover:bg-white/5",
                )}
              >
                <item.icon
                  size={18}
                  className={cn(
                    activeTab === item.id
                      ? "opacity-100"
                      : "opacity-70 group-hover:opacity-100 transition-opacity",
                  )}
                />
                {!collapsed && <span>{item.label}</span>}
                {collapsed && (
                  <div className="absolute left-16 bg-gray-900 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 font-normal">
                    {item.label}
                  </div>
                )}
              </button>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-2">
          {!collapsed && (
            <div className="p-3 bg-white/5 rounded-xl flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold text-xs">
                {user?.name[0]}
                {user?.name[1]}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-xs font-bold truncate text-white">
                  {user?.name}
                </p>
                <p className="text-[10px] text-sidebar-text truncate">
                  {user?.role}
                </p>
              </div>
            </div>
          )}
          <button
            onClick={() => {
              dispatch(clearToken());
              dispatch(clearUserData());
              toast.info("Logged out");
              setTimeout(() => {
                navigate("/login");
              }, 2000);
            }}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[0.875rem] transition-all duration-200 group relative",
              "text-sidebar-text hover:bg-white/5",
            )}
          >
            <LogOut
              size={18}
              className="opacity-70 group-hover:opacity-100 transition-opacity"
            />
            {!collapsed && <span>Logout</span>}
            {collapsed && (
              <div className="absolute left-16 bg-gray-900 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 font-normal">
                Logout
              </div>
            )}
          </button>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center p-2 rounded-lg text-sidebar-text hover:bg-white/5 transition-colors"
          >
            {collapsed ? (
              <ChevronRight size={18} />
            ) : (
              <div className="flex items-center gap-2">
                <ChevronLeft size={18} />{" "}
                <span className="text-xs font-medium">Collapse Sidebar</span>
              </div>
            )}
          </button>
        </div>
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: -220 }}
              animate={{ x: 0 }}
              exit={{ x: -220 }}
              className="fixed inset-y-0 left-0 w-[220px] bg-sidebar-bg z-50 md:hidden flex flex-col shadow-2xl"
            >
              <div className="py-6 px-5 font-extrabold text-[1.25rem] text-white border-b border-white/10 flex items-center justify-between">
                <span>EDUCORE</span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="text-sidebar-text"
                >
                  <X size={20} />
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
                {allowedNavItems.map((item) => (
                  <NavLink to={item.id} key={item.id}>
                    <button
                      onClick={() => {
                        setMobileOpen(false);
                      }}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all text-sm",
                        activeTab === item.id
                          ? "bg-sidebar-active text-white font-semibold"
                          : "text-sidebar-text hover:bg-white/5",
                      )}
                    >
                      <item.icon size={18} />
                      <span>{item.label}</span>
                    </button>
                  </NavLink>
                ))}
              </nav>
              <button
                onClick={() => {
                  dispatch(clearToken());
                  dispatch(clearUserData());
                  toast.info("Logged out");
                  setTimeout(() => {
                    navigate("/login");
                  }, 2000);
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[0.875rem] transition-all duration-200 group relative",
                  "text-sidebar-text hover:bg-white/5",
                )}
              >
                <LogOut
                  size={18}
                  className="opacity-70 group-hover:opacity-100 transition-opacity"
                />
                {!collapsed && <span>Logout</span>}
                {collapsed && (
                  <div className="absolute left-16 bg-gray-900 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 font-normal">
                    Logout
                  </div>
                )}
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden h-screen bg-bg-base">
        {/* Topbar */}
        <header className="h-[64px] bg-white border-b border-gray-200 px-8 flex items-center justify-between sticky top-0 z-30 shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileOpen(true)}
              className="p-2 md:hidden text-gray-500 hover:bg-gray-100 rounded-lg"
            >
              <MenuIcon size={24} />
            </button>
            {school && (
              <div>
                <h1 className="text-[1.1rem] font-bold text-text-main leading-tight">
                  {school.name}
                </h1>
                <p className="text-[0.75rem] text-text-muted uppercase tracking-wider font-medium">
                  {school.currentTerm} • {school.currentYear} Academic Year
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden lg:block w-64">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-1.5 bg-bg-base border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary/20 focus:border-primary/40 transition-all placeholder:text-text-muted"
              />
            </div>

            <div className="flex items-center gap-4 pl-1">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold">{user?.name}</p>
                <p className="text-[0.75rem] text-text-muted">{user?.role}</p>
              </div>
              <div className="w-[40px] h-[40px] border-radius-[50%] bg-gray-200 flex items-center justify-center font-semibold text-sm rounded-full">
                {user?.name[0]}
                {user?.name[1]}
              </div>
            </div>
          </div>
        </header>

        {/* Page Area */}
        <main className="flex-1 overflow-y-auto p-8 bg-bg-base">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.1 }}
            className="w-full"
          >
                    <Outlet />

          </motion.div>
        </main>
      </div>
    </div>
  );
};
