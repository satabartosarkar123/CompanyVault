/* eslint-env jest */
import React from "react";
import { jest, describe, beforeEach, it, expect } from "@jest/globals";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import Login from "./Login";
import authReducer from "../store/authSlice";
import companyReducer from "../store/companySlice";
import { login as loginApi } from "../api/authApi";
import { toast } from "react-toastify";

jest.mock("../api/authApi", () => ({
  login: jest.fn(),
}));

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const renderWithProviders = () => {
  const store = configureStore({
    reducer: {
      auth: authReducer,
      company: companyReducer,
    },
  });

  const utils = render(
    <Provider store={store}>
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    </Provider>
  );

  return { store, ...utils };
};

describe("Login page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders email and password fields", () => {
    renderWithProviders();

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  it("displays validation errors when submitting empty form", async () => {
    renderWithProviders();

    await userEvent.click(screen.getByRole("button", { name: /login/i }));

    expect(
      await screen.findByText(/email is required/i)
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/password is required/i)
    ).toBeInTheDocument();
  });

  it("submits form and dispatches auth data on success", async () => {
    loginApi.mockResolvedValueOnce({
      data: {
        user: { fullname: "Jane Doe", email: "jane@example.com" },
        token: "token-123",
        company: { name: "Acme Corp" },
      },
    });

    const { store } = renderWithProviders();

    await userEvent.type(screen.getByLabelText(/email/i), "jane@example.com");
    await userEvent.type(screen.getByLabelText(/password/i), "password123");
    await userEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() =>
      expect(loginApi).toHaveBeenCalledWith({
        email: "jane@example.com",
        password: "password123",
      })
    );

    expect(toast.success).toHaveBeenCalledWith("Logged in!");
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");

    const state = store.getState();
    expect(state.auth.user).toEqual({
      fullname: "Jane Doe",
      email: "jane@example.com",
    });
    expect(state.auth.token).toBe("token-123");
    expect(state.company.company).toEqual({ name: "Acme Corp" });
  });

  it("shows toast error when login fails", async () => {
    loginApi.mockRejectedValueOnce(
      new Error("Request failed with status code 401")
    );

    renderWithProviders();

    await userEvent.type(screen.getByLabelText(/email/i), "jane@example.com");
    await userEvent.type(screen.getByLabelText(/password/i), "password123");
    await userEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith(
        "Request failed with status code 401"
      )
    );
  });
});
