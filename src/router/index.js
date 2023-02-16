import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      redirect: "/orders",
      component: () => import("../views/Layouts/Form.vue"),
      children: [
        {
          path: "/orders",
          name: "Buyurtmalar",
          component: () => import("../views/Home/Form.vue"),
        },
        {
          path: "/about",
          name: "Haydovchilar",
          component: () => import("../views/Driver/Home.vue"),
        },
        {
          path: "/locations",
          name: "Joylashuv qo'shish",
          component: () => import("../views/CustomLocation/Form.vue"),
        },
        {
          path: "/report",
          name: "Hisobot",
          redirect: { name: "report_order" },
          children: [
            {
              path: "/report/orders",
              name: "Buyurtmalar hisoboti",
              component: () => import("../views/Hisobot/Form.vue"),
            },
            {
              path: "/report/drivers",
              name: "Haydovchilar hisoboti",
              component: () => import("../views/Hisobot/Form.vue"),
            },
          ],
        },
        {
          path: "/user",
          name: "Foydalanuvchilar",
          component: () => import("../views/users/Form.vue"),
        },
        {
          path: "/definitions",
          name: "Ta'riflar",
          component: () => import("../views/tariflar/Form.vue"),
        },
      ],
    },
    {
      path: "/login",
      name: "Kirish",
      component: () => import("../views/Login/Login.vue"),
    },
  ],
});
router.beforeEach((to, from, next) => {
  const publicPages = ["/login"];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem("token");
  // trying to access a restricted page + not logged in
  // redirect to login page
  if (authRequired && !loggedIn) {
    next("/login");
  } else {
    next();
  }
});

export default router;
