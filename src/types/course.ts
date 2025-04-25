export interface Course {
    id: number;
    name: string;
    questionCount: number;
    duration: number;
    passScore: number;
    domains: Domain[];
    imageUrl: string;
    description: string;
}

export interface Domain {
    name: string;
    questionCount: number;
}
