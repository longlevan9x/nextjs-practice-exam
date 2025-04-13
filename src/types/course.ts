export interface Course {
    id: number;
    name: string;
    questionCount: number;
    duration: number;
    passScore: number;
    domains: Domain[];
}

export interface Domain {
    name: string;
    questionCount: number;
}
