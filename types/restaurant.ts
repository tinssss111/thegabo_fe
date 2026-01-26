export interface Restaurant {
    _id: string;
    name: string;
    logo: string;
    banner: string;
    email: string;
    phoneNumber: string;
    addresses: string;
    rating: number;
    deliveryTime: number;
    deliveryFee: number;
    status: string;
    isActive: boolean;
    role: number;
    address?: string;
    phone?: string;
    categories?: string[];
}
