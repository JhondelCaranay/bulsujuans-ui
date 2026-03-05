"use client";

import React from "react";
import ProfileHeader from "./components/profile-header";
import ProfileInfo from "./components/profile-info";
import { EducationSection } from "./components/education-section";
import { ExperienceSection } from "./components/experience-section";
import { useAuth } from "@/hooks/useAuth";
import { useQueryProcessor } from "@/hooks/useTanstackQuery";
import { Education, Experience, User } from "@/types";
import { PageLoading } from "@/components/page-loading";

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
export interface EducationQuery {
  data: Education[];
  success: boolean;
  message: string;
}

const Page = () => {
  const { user } = useAuth();

  const { data: userData } = useQueryProcessor<UserQuery>({
    url: `/users/show/${user?.id}`,
    key: ["users", user?.id],
    options: {
      enabled: !!user?.id,
    },
  });

  const { data: experienceData } = useQueryProcessor<ExperienceQuery>({
    url: `/experiences/list`,
    key: ["experiences", user?.id],
    options: {
      enabled: !!user?.id,
    },
    queryParams: {
      user_id: user?.id,
    },
  });

  const { data: educationData } = useQueryProcessor<EducationQuery>({
    url: `/education/list`,

    key: ["educations", user?.id],
    options: {
      enabled: !!user?.id,
    },
    queryParams: {
      user_id: user?.id,
    },
  });

  if (!userData?.data || !experienceData?.data || !educationData?.data) {
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
      <EducationSection items={educationData.data} />
    </div>
  );
};

export default Page;
