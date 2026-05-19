import jwt from "jsonwebtoken";
import { config } from "../../config/config.js";
import { AuthRepository } from "./auth.repository.js";
import { comparePassword } from "../../lib/encryptDecrypt.js";
import { AuthResponse, LogoutResponse, AccessTokenPayload, RefreshTokenPayload, LoginCredentials } from "./auth.types.js";
import { StringValue } from "ms";

export class AuthService {
    private authRepository: AuthRepository;

    constructor() {
        this.authRepository = new AuthRepository();
    }

    // 1. Login 
    async login(dto: LoginCredentials): Promise<AuthResponse> {
        const user = await this.authRepository.findActiveUserByUsername(dto.userName);
        if (!user) {
            throw new Error("Invalid credentials");
        }

        // Using our custom common encryption library!
        const passwordMatch = await comparePassword(dto.password, user.passwordHash);
        if (!passwordMatch) {
            throw new Error("Invalid credentials");
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

        return { accessToken, refreshToken };
    }

    // 2. Logout Logic (stateless)
    logout(): LogoutResponse {
        return { message: "Logged out successfully" };
    }

    // 3. Refresh Token Logic
    async refresh(refreshToken: string): Promise<AuthResponse> {
        let payload: RefreshTokenPayload;

        try {
            payload = jwt.verify(refreshToken, config.JWT_SECRET) as RefreshTokenPayload;
        } catch {
            throw new Error("Invalid refresh token");
        }

        if (payload.tokenType !== "refresh") {
            throw new Error("Invalid token type");
        }

        const userWithPermissions = await this.authRepository.findUserWithPermissions(payload.sub);
        if (!userWithPermissions) {
            throw new Error("User not found");
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

        return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    }
}
