
export const translations = {
  en: {
    appName: 'LAN Stream',
    verifyingAccess: 'Verifying access...',
    add: 'Add',
    remove: 'Remove',
    login: {
      subtitle: 'Sign in to access your internal video network.',
      welcome: 'Welcome',
      enterCredentials: 'Enter your credentials to continue.',
      username: 'Username',
      password: 'Password',
      showPassword: 'Show password',
      hidePassword: 'Hide password',
      signIn: 'Sign In',
      signingIn: 'Signing In...',
    },
    dashboard: {
      title: 'Video Catalog',
      subtitle: 'Browse and stream available content on the local network.',
      clientTitle: 'Welcome!',
      clientSubtitle: 'Browse and stream available content.',
    },
    userManagement: {
      title: 'User Management',
      subtitle: 'Add, remove, and manage users who can access the video streams.',
      form: {
          title: 'Registered Users',
          description: 'Manage the list of users who are permitted to log in and access content.',
          usernameLabel: 'Username',
          usernamePlaceholder: 'Enter a new username',
          passwordLabel: 'Password',
          passwordPlaceholder: 'Enter a password',
          subscriptionLabel: 'Subscription Period',
          subscriptionPlaceholder: 'Select a period',
      },
      table: {
          username: 'Username',
          status: 'Status',
          expiresOn: 'Expires On',
          actions: 'Actions',
          noUsers: 'No users have been added yet.',
      },
      status: {
          active: 'Active',
          inactive: 'Inactive',
          expired: 'Expired',
      },
      periods: {
          week: '1 Week',
          month: '1 Month',
          unlimited: 'Unlimited',
      },
      toggleStatus: 'Toggle user status',
      toast: {
          userExists: {
            title: 'User Exists',
            description: 'This username is already taken.',
          },
          statusChanged: {
            title: 'Status Updated',
            description: 'User status has been successfully changed.',
          }
      }
    },
    settings: {
        title: 'Content Management',
        subtitle: 'Manage the video content available in the catalog.',
        addByLink: 'Add by Link',
        addByUpload: 'Add by Upload',
        newVideo: {
            title: 'Add New Video',
            description: 'Add a new video by providing a direct stream link or by uploading a file.',
            videoTitleLabel: 'Video Title',
            videoTitlePlaceholder: 'e.g., Company All-Hands Q1',
            videoLinkLabel: 'Video Stream Link',
            videoLinkPlaceholder: 'e.g., http://server/stream.mp4',
            addVideo: 'Add Video'
        },
        upload: {
            fileLabel: 'Video File',
            uploadAndAdd: 'Upload and Add Video',
            uploading: 'Uploading...',
        },
        videoList: {
            title: 'Video Catalog',
            description: 'List of all videos currently in the catalog.',
            noVideos: 'No videos have been added yet. Use the form above to add one.'
        },
        toast: {
            videoAdded: {
                title: 'Video Added',
                description: 'The new video has been added to the catalog.'
            }
        }
    },
    sidebar: {
      dashboard: 'Dashboard',
      settings: 'Content',
      userManagement: 'Users',
      accessControl: 'Access Control',
      logout: 'Logout',
      toggleTheme: 'Toggle theme',
      toggleLanguage: 'Toggle language',
      adminUser: {
        name: 'Admin User',
        email: 'admin@lanstream.local',
      },
      clientUser: {
        name: 'Client User',
        email: 'client@lanstream.local',
      }
    },
    videoCard: {
      watchNow: 'Watch Now',
      noSummary: 'No summary available.',
      noVideos: {
        title: 'The Catalog is Empty',
        description: 'The administrator has not added any videos yet.'
      }
    },
    watch: {
        backToCatalog: 'Back to Catalog',
        loadingVideo: 'Loading video details...',
    },
    videoPlayer: {
        browserNotSupported: 'Your browser does not support the video tag.',
        resolution: 'Resolution',
        adaptiveBitrate: 'Adaptive bitrate simulation'
    },
    toast: {
        loginSuccess: {
            title: "Login Successful",
            description: "Welcome back!",
        },
        loginFailed: {
            title: "Login Failed",
            description: "Invalid username or password.",
        },
        userAdded: {
            title: "User Added",
            description: "A new user has been successfully added.",
        },
        userRemoved: {
            title: "User Removed",
            description: "The selected item has been removed.",
        },
        formError: {
            title: "Missing Information",
            description: "Please fill out all fields.",
        },
        accountError: {
            title: "Access Denied",
            description: "Your account is inactive or has expired. Please contact the administrator.",
        }
    }
  },
  ar: {
    appName: 'لان ستريم',
    verifyingAccess: 'يتم التحقق من الوصول...',
    add: 'إضافة',
    remove: 'إزالة',
    login: {
      subtitle: 'سجل الدخول للوصول إلى شبكة الفيديو الداخلية الخاصة بك.',
      welcome: 'أهلاً بك',
      enterCredentials: 'أدخل بيانات الاعتماد الخاصة بك للمتابعة.',
      username: 'اسم المستخدم',
      password: 'كلمة المرور',
      showPassword: 'إظهار كلمة المرور',
      hidePassword: 'إخفاء كلمة المرور',
      signIn: 'تسجيل الدخول',
      signingIn: 'جارٍ تسجيل الدخول...',
    },
    dashboard: {
      title: 'كتالوج الفيديو',
      subtitle: 'تصفح وبث المحتوى المتاح على الشبكة المحلية.',
      clientTitle: 'أهلاً بك!',
      clientSubtitle: 'تصفح وبث المحتوى المتاح.',
    },
    userManagement: {
      title: 'إدارة المستخدمين',
      subtitle: 'إضافة وإزالة وإدارة المستخدمين الذين يمكنهم الوصول إلى بث الفيديو.',
      form: {
          title: 'المستخدمون المسجلون',
          description: 'إدارة قائمة المستخدمين المسموح لهم بتسجيل الدخول والوصول إلى المحتوى.',
          usernameLabel: 'اسم المستخدم',
          usernamePlaceholder: 'أدخل اسم مستخدم جديد',
          passwordLabel: 'كلمة المرور',
          passwordPlaceholder: 'أدخل كلمة المرور',
          subscriptionLabel: 'فترة الاشتراك',
          subscriptionPlaceholder: 'اختر فترة',
      },
      table: {
          username: 'اسم المستخدم',
          status: 'الحالة',
          expiresOn: 'تاريخ الانتهاء',
          actions: 'الإجراءات',
          noUsers: 'لم يتم إضافة أي مستخدمين بعد.',
      },
      status: {
          active: 'نشط',
          inactive: 'غير نشط',
          expired: 'منتهي الصلاحية',
      },
      periods: {
          week: 'أسبوع واحد',
          month: 'شهر واحد',
          unlimited: 'غير محدود',
      },
      toggleStatus: 'تبديل حالة المستخدم',
      toast: {
          userExists: {
              title: 'المستخدم موجود',
              description: 'اسم المستخدم هذا مستخدم بالفعل.',
          },
          statusChanged: {
              title: 'تم تحديث الحالة',
              description: 'تم تغيير حالة المستخدم بنجاح.',
          }
      }
    },
     settings: {
        title: 'إدارة المحتوى',
        subtitle: 'إدارة محتوى الفيديو المتاح في الكتالوج.',
        addByLink: 'إضافة عبر الرابط',
        addByUpload: 'إضافة عبر الرفع',
        newVideo: {
            title: 'إضافة فيديو جديد',
            description: 'أضف فيديو جديدًا عن طريق توفير رابط بث مباشر أو عن طريق رفع ملف.',
            videoTitleLabel: 'عنوان الفيديو',
            videoTitlePlaceholder: 'مثال: اجتماع الشركة للربع الأول',
            videoLinkLabel: 'رابط بث الفيديو',
            videoLinkPlaceholder: 'مثال: http://server/stream.mp4',
            addVideo: 'إضافة فيديو'
        },
        upload: {
            fileLabel: 'ملف الفيديو',
            uploadAndAdd: 'رفع وإضافة الفيديو',
            uploading: 'جارٍ الرفع...',
        },
        videoList: {
            title: 'كتالوج الفيديو',
            description: 'قائمة بجميع الفيديوهات الموجودة حاليًا في الكتالوج.',
            noVideos: 'لم يتم إضافة أي فيديوهات بعد. استخدم النموذج أعلاه لإضافة واحد.'
        },
        toast: {
            videoAdded: {
                title: 'تمت إضافة الفيديو',
                description: 'تمت إضافة الفيديو الجديد إلى الكتالوج.'
            }
        }
    },
    sidebar: {
      dashboard: 'لوحة التحكم',
      settings: 'المحتوى',
      userManagement: 'المستخدمون',
      accessControl: 'التحكم بالوصول',
      logout: 'تسجيل الخروج',
      toggleTheme: 'تبديل السمة',
      toggleLanguage: 'تبديل اللغة',
      adminUser: {
        name: 'المسؤول',
        email: 'admin@lanstream.local',
      },
      clientUser: {
          name: 'زبون',
          email: 'client@lanstream.local',
      }
    },
    videoCard: {
      watchNow: 'شاهد الآن',
      noSummary: 'لا يوجد ملخص متاح.',
      noVideos: {
        title: 'الكتالوج فارغ',
        description: 'لم يقم المسؤول بإضافة أي فيديوهات بعد.'
      }
    },
    watch: {
        backToCatalog: 'العودة إلى الكتالوج',
        loadingVideo: 'جارٍ تحميل تفاصيل الفيديو...'
    },
    videoPlayer: {
        browserNotSupported: 'متصفحك لا يدعم علامة الفيديو.',
        resolution: 'الدقة',
        adaptiveBitrate: 'محاكاة معدل البت التكيفي'
    },
    toast: {
        loginSuccess: {
            title: "تم تسجيل الدخول بنجاح",
            description: "مرحبا بعودتك!",
        },
        loginFailed: {
            title: "فشل تسجيل الدخول",
            description: "اسم المستخدم أو كلمة المرور غير صالحة.",
        },
        userAdded: {
            title: "تمت إضافة المستخدم",
            description: "تمت إضافة مستخدم جديد بنجاح.",
        },
        userRemoved: {
            title: "تم حذف العنصر",
            description: "تم حذف العنصر المحدد.",
        },
        formError: {
            title: "معلومات ناقصة",
            description: "يرجى ملء جميع الحقول.",
        },
        accountError: {
            title: "الوصول مرفوض",
            description: "حسابك غير نشط أو انتهت صلاحيته. يرجى الاتصال بالمسؤول.",
        }
    }
  },
};

export type Language = keyof typeof translations;
export type TranslationKey = keyof (typeof translations)['en'];
