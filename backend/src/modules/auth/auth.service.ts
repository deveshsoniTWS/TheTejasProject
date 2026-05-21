import jwt from "jsonwebtoken";
import { config } from "../../config/config";
import { AuthRepository } from "./auth.repository";
import { comparePassword } from "../../lib/encryptDecrypt";
import { AuthResponse, LogoutResponse, AccessTokenPayload, RefreshTokenPayload, LoginCredentials } from "./auth.types";
import { StringValue } from "ms";
import { errorResponse, successResponse } from "../../utils/ErrorSuccessResponse";
import { ErrorResponseType, SuccessResponseType } from "../../utils/types";

export class AuthService {
    private authRepository: AuthRepository;

    constructor() {
        this.authRepository = new AuthRepository();
    }

    // 1. Login 
    async login(dto: LoginCredentials): Promise<SuccessResponseType<AuthResponse> | ErrorResponseType> {
        const user = await this.authRepository.findActiveUserByUsername(dto.userName);
        if (!user) {
            return errorResponse("Invalid credentials", 401);
        }

        // Using our custom common encryption library!
        const passwordMatch = await comparePassword(dto.password, user.passwordHash);
        if (!passwordMatch) {
            return errorResponse("Invalid credentials", 401);
        }

        const userWithPermissions = await this.authRepository.findUserWithPermissions(user.id);

        const accessPayload: AccessTokenPayload = {
            sub: user.id,
            userName: user.userName,
            roles: userWithPermissions?.roles ?? [],
            permissions: userWithPermissions?.permissions ?? [],
        };

        const refreshPayload: RefreshTokenPayload = {
            sub: user.id,
            tokenType: "refresh",
        };

        // Sign the Access Token (expires in 15 minutes)
        const accessToken = jwt.sign(accessPayload, config.JWT_SECRET, {
            expiresIn: config.JWT_ACCESS_EXPIRES_IN as StringValue,
        });

        // Sign the Refresh Token (expires in 7 days)
        const refreshToken = jwt.sign(refreshPayload, config.JWT_SECRET, {
            expiresIn: config.JWT_REFRESH_EXPIRES_IN as StringValue,
        });

        return successResponse("Login successful", { accessToken, refreshToken });
    }

    // 2. Logout Logic (stateless)
    logout(): SuccessResponseType<LogoutResponse> {
        return successResponse("Logged out successfully", { message: "Logged out successfully" });
    }

    // 3. Refresh Token Logic
    async refresh(refreshToken: string): Promise<SuccessResponseType<AuthResponse> | ErrorResponseType> {
        let payload: RefreshTokenPayload;

        try {
            payload = jwt.verify(refreshToken, config.JWT_SECRET) as RefreshTokenPayload;
        } catch {
            return errorResponse("Invalid refresh token", 401);
        }

        if (payload.tokenType !== "refresh") {
            return errorResponse("Invalid token type", 401);
        }

        const userWithPermissions = await this.authRepository.findUserWithPermissions(payload.sub);
        if (!userWithPermissions) {
            return errorResponse("User not found", 404);
        }

        const newAccessPayload: AccessTokenPayload = {
            sub: payload.sub,
            userName: userWithPermissions.userName,
            roles: userWithPermissions.roles,
            permissions: userWithPermissions.permissions,
        };

        const newRefreshPayload: RefreshTokenPayload = {
            sub: payload.sub,
            tokenType: "refresh",
        };

        const newAccessToken = jwt.sign(newAccessPayload, config.JWT_SECRET, {
            expiresIn: config.JWT_ACCESS_EXPIRES_IN as StringValue,
        });

        const newRefreshToken = jwt.sign(newRefreshPayload, config.JWT_SECRET, {
            expiresIn: config.JWT_REFRESH_EXPIRES_IN as StringValue,
        });

        return successResponse("Tokens refreshed successfully", { accessToken: newAccessToken, refreshToken: newRefreshToken });
    }
}
