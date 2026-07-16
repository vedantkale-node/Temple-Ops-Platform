import { HTTP_CODES } from "@/constants";
import { Request, Response } from "express";
import axios from "axios";
import { env } from "@/config";
import { loginSchema } from "../auth";
import { CreateUserSchema } from "../users";
import { safeParse } from "@/utils";
import { renderHTMX } from "@/utils/renderPage";

type ProfileViewModel = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  role: string;
  verified: boolean;
};

const apiUrl = env.BASE_API_URL;

export const homePage = (req: Request, res: Response) => {
  res.render("home", {
    title: "Dashboard",
    layout: "dashboard",
  });
};

export const loginPage = (req: Request, res: Response) => {
  const flashError = req.flash("error")[0];
  const flashOld = req.flash("old")[0];

  const errors =
    safeParse<{ errors: Record<string, string[]> } | null>(flashError, null)
      ?.errors ?? null;

  const old = safeParse<Record<string, unknown>>(flashOld, {});

  res.render("pages/login", {
    title: "Temple Ops | Login",
    layout: "main",
    errors,
    old,
  });
};

export const loginPost = async (req: Request, res: Response) => {
  const result = loginSchema.safeParse(req.body);

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;

    req.flash(
      "error",
      JSON.stringify({
        errors: {
          email: errors.email,
          password: errors.password,
        },
      }),
    );
    req.flash("old", JSON.stringify({ email: req.body.email || "" }));

    return res.redirect("/login");
  }

  const { email, password } = result.data;

  try {
    const apiRes = await axios.post(
      `${apiUrl}/auth/login`,
      {
        email,
        password,
      },
      {
        withCredentials: true,
        validateStatus: () => true,
      },
    );
    const setCookie = apiRes.headers["set-cookie"];
    if (setCookie) {
      res.setHeader("Set-Cookie", setCookie);
    }
    if (apiRes.status === 200) {
      return res.redirect("/");
    }
    req.flash(
      "error",
      JSON.stringify({
        errors: apiRes.data.message || "Invalid credentials",
      }),
    );

    req.flash("old", JSON.stringify({ email }));
    return res.redirect("/login");
  } catch {
    return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).render("pages/login", {
      layout: "main",
      error: "Something went wrong",
      old: { email },
    });
  }
};

export const logoutPost = async (req: Request, res: Response) => {
  try {
    const apiRes = await axios.post(
      `${apiUrl}/auth/logout`,
      {},
      {
        headers: {
          cookie: req.headers.cookie || "",
        },
        withCredentials: true,
        validateStatus: () => true,
      },
    );
    const setCookie = apiRes.headers["set-cookie"];
    if (setCookie) {
      res.setHeader("Set-cookie", setCookie);
    }
    res.setHeader("HX-Redirect", "/login");
    return res.status(HTTP_CODES.OK).end();
  } catch {
    return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).end();
  }
};

export const signUpPage = (req: Request, res: Response) => {
  const flashError = req.flash("error")[0];
  const flashOld = req.flash("old")[0];

  const parsedErrors = safeParse<{ errors: Record<string, string[]> } | null>(
    flashError,
    null,
  );

  const parsedOld = safeParse(flashOld, null);

  const errors = parsedErrors?.errors || null;

  res.render("pages/signup", {
    title: "Register User",
    layout: "main",
    errors,
    old: parsedOld,
  });
};

export const signUpPost = async (req: Request, res: Response) => {
  const { confirmPassword, ...payload } = req.body;
  const parsed = CreateUserSchema.safeParse(payload);

  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors;
    req.flash(
      "error",
      JSON.stringify({
        errors: {
          firstName: errors.firstName,
          lastName: errors.lastName,
          username: errors.username,
          email: errors.email,
          password: errors.password,
        },
      }),
    );

    req.flash(
      "old",
      JSON.stringify({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: req.body.username,
        email: req.body.email,
      }),
    );
    return res.redirect("/signup");
  }

  const { firstName, lastName, username, email, password } = parsed.data;

  if (password !== confirmPassword) {
    req.flash(
      "error",
      JSON.stringify({
        errors: { confirmPassword: ["Passwords do not match"] },
      }),
    );

    req.flash(
      "old",
      JSON.stringify({
        firstName,
        lastName,
        username,
        email,
      }),
    );

    return res.redirect("/signup");
  }

  try {
    const apiRes = await axios.post(
      `${apiUrl}/user`,
      { firstName, lastName, username, email, password },
      {
        withCredentials: true,
        validateStatus: () => true,
      },
    );

    if (apiRes.status === 200 || apiRes.status === 201) {
      return res.redirect("/login");
    }

    req.flash(
      "error",
      JSON.stringify({
        errors: apiRes.data?.message || "Signup failed",
      }),
    );

    req.flash("old", JSON.stringify({ firstName, lastName, username, email }));
    return res.redirect("/signup");
  } catch {
    return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).render("pages/signup", {
      layout: "main",
      error: "Something went wrong",
    });
  }
};

export const profilePage = async (req: Request, res: Response) => {
  try {
    const apiRes = await axios.get(`${apiUrl}/user/me`, {
      headers: {
        cookie: req.headers.cookie || "",
      },
      withCredentials: true,
      validateStatus: () => true,
    });
    const vm: ProfileViewModel = apiRes.data.data;
    renderHTMX(req, res, "pages/sections/profile", {
      vm,
      title: "Profile",
    });
  } catch {
    return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).render("pages/login", {
      layout: "main",
      error: "Something went wrong",
    });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const apiRes = await axios.get(`${apiUrl}/user/me`, {
      headers: {
        cookie: req.headers.cookie || "",
      },
      withCredentials: true,
      validateStatus: () => true,
    });
    const id = apiRes.data.data._id;
    if (!id) {
      res.setHeader("HX-Redirect", "/");
      return res.end();
    }
    if (id) {
      await axios.delete(`${apiUrl}/user/${id}`, {
        headers: {
          cookie: req.headers.cookie || "",
        },
        withCredentials: true,
        validateStatus: () => true,
      });
      res.clearCookie("token");
    }
    res.setHeader("HX-Redirect", "/login");
    return res.end();
  } catch {
    return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).render("pages/login", {
      layout: "main",
      error: "Something went wrong",
    });
  }
};

export const settingsPage = async (req: Request, res: Response) => {
  try {
    const apiRes = await axios.get(`${apiUrl}/temple`, {
      headers: {
        cookie: req.headers.cookie || "",
      },
      withCredentials: true,
      validateStatus: () => true,
    });

    if (apiRes.status !== HTTP_CODES.OK) {
      return res.status(apiRes.status).render("pages/sections/settings", {
        layout: "dashboard",
        title: "Settings",
        temple: [],
        error: apiRes.data?.message || "Unable to fetch temple settings",
      });
    }

    const { users } = apiRes.data.data;
    renderHTMX(req, res, "pages/sections/settings", {
      title: "Settings",
      temple: users,
    });
  } catch {
    return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).render("pages/login", {
      layout: "main",
      error: "Something went wrong",
    });
  }
};

export const logsPage = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const apiRes = await axios.get(`${apiUrl}/audit?page=${page}`, {
      headers: {
        cookie: req.headers.cookie,
      },
      withCredentials: true,
      validateStatus: () => true,
    });
    const data = apiRes.data.data;
    renderHTMX(req, res, "pages/sections/logs", {
      title: "Logs",
      logs: data.logs,
      page: data.page,
      total: data.total,
      totalPages: data.pages,
      nextPage: data.page + 1,
      prevPage: data.page - 1,
    });
  } catch {
    return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).render("pages/login", {
      layout: "main",
      error: "Something went wrong",
    });
  }
};
