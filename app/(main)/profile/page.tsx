"use client";

import React from "react";
import ProfileHeader from "./components/profile-header";
import ProfileInfo from "./components/profile-info";
import { EducationSection } from "./components/education-section";
import { ExperienceSection } from "./components/experience-section";
import { useAuth } from "@/hooks/useAuth";
import { useQueryProcessor } from "@/hooks/useTanstackQuery";
import { Experience, User } from "@/types";
import { PageLoading } from "@/components/page-loading";

const NODE_ENV = process.env.NODE_ENV || "development";

export interface UserQuery {
  data: User;
  success: boolean;
  message: string;
}

export interface ExperienceQuery {
  data: Experience[];
  success: boolean;
  message: string;
}

const Page = () => {
  const { user } = useAuth();

  const { data: userData, isLoading: isUserLoading } = useQueryProcessor<UserQuery>({
    url: `/users/show/${user?.id}`,
    key: ["users", user?.id],
    options: {
      enabled: !!user?.id,
    },
  });

  const { data: experienceData, isLoading: isExperienceLoading } = useQueryProcessor<ExperienceQuery>({
    url: `/experiences/list`,

    key: ["experiences", user?.id],
    options: {
      enabled: !!user?.id,
    },
    queryParams: {
      user_id: user?.id,
    },
  });

  if (!userData?.data || !experienceData?.data || isUserLoading || isExperienceLoading) {
    return (
      <div className="w-full h-full p-10">
        <PageLoading />
      </div>
    );
  }

  return (
    <div className="w-full h-full p-10 space-y-10">
      <div className="">
        <h1 className="text-3xl font-bold text-foreground">Profile</h1>
        <p className="text-muted-foreground">Manage your profile information</p>
      </div>
      <ProfileHeader data={userData?.data} />

      <ProfileInfo data={userData?.data} />

      <ExperienceSection items={experienceData.data} />
      <EducationSection items={educationData} />

      {NODE_ENV === "development" && (
        <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm text-foreground">
          <p>total permissions: {user?.permissions ? Object.keys(user.permissions).length : 0}</p>
          <code>{JSON.stringify(user?.permissions, null, 2)}</code>
        </pre>
      )}
    </div>
  );
};

export default Page;

export const experienceData = [
  {
    role: "Senior Product Designer",
    company: "Tech Company Inc.",
    period: "2022 - Present",
    description: "Led design initiatives for mobile and web applications, mentored junior designers.",
  },
  {
    role: "Product Designer",
    company: "Creative Studio",
    period: "2020 - 2022",
    description: "Designed user interfaces and conducted user research for various clients.",
  },
];

export const educationData = [
  {
    title: "Bachelor of Fine Arts in Graphic Design",
    school: "Design University",
    year: "2020",
    description: "Specialized in digital design and user experience.",
  },
];
