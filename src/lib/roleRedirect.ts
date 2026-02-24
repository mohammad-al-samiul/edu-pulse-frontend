export const getDashboardByRole = (role?: string) => {
  switch (role) {
    case "ADMIN":
    case "SUPER_ADMIN":
      return "/admin/dashboard";
    case "INSTRUCTOR":
      return "/instructor/dashboard";
    case "STUDENT":
      return "/student/dashboard";
    default:
      return "/student/dashboard";
  }
};
