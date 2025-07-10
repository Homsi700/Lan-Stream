
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
    },
    accessControl: {
      title: 'Access Management',
      subtitle: 'Control which devices can access the video stream via the MikroTik integration.',
      integrationCard: {
        title: 'MikroTik Integration',
        description: 'This interface allows you to manage access rules that can be applied to your MikroTik router. Approved IP and MAC addresses will be allowed to connect to the video streaming service.',
        status: 'Status: Connected & Active',
      },
      form: {
          title: 'Approved Addresses',
          description: 'Manage the list of IP and MAC addresses that are permitted to access content.',
          newAddressLabel: 'New Address',
          newAddressPlaceholder: 'Enter IP or MAC address',
      },
      table: {
          address: 'Address',
          type: 'Type',
          actions: 'Actions',
          noAddresses: 'No addresses on the allow list.',
      }
    },
    sidebar: {
      dashboard: 'Dashboard',
      settings: 'Settings',
      logout: 'Logout',
      toggleTheme: 'Toggle theme',
      toggleLanguage: 'Toggle language',
      adminUser: {
        name: 'Admin User',
        email: 'admin@lanstream.local',
      },
    },
    videoCard: {
      watchNow: 'Watch Now',
    },
    watch: {
        backToCatalog: 'Back to Catalog'
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
        invalidAddress: {
            title: "Invalid Address",
            description: "Please enter a valid IP or MAC address.",
        },
        addressExists: {
            title: "Address exists",
            description: "This address is already on the list.",
        },
        addressAdded: {
            title: "Address Added",
            description: "has been added to the allow list.",
        },
        addressRemoved: {
            title: "Address Removed",
            description: "has been removed.",
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
    },
    accessControl: {
      title: 'إدارة الوصول',
      subtitle: 'تحكم في الأجهزة التي يمكنها الوصول إلى بث الفيديو عبر تكامل MikroTik.',
      integrationCard: {
        title: 'تكامل MikroTik',
        description: 'تتيح لك هذه الواجهة إدارة قواعد الوصول التي يمكن تطبيقها على جهاز التوجيه MikroTik الخاص بك. سيتم السماح لعناوين IP و MAC المعتمدة بالاتصال بخدمة بث الفيديو.',
        status: 'الحالة: متصل ونشط',
      },
       form: {
          title: 'العناوين المعتمدة',
          description: 'إدارة قائمة عناوين IP و MAC المسموح لها بالوصول إلى المحتوى.',
          newAddressLabel: 'عنوان جديد',
          newAddressPlaceholder: 'أدخل عنوان IP أو MAC',
      },
      table: {
          address: 'العنوان',
          type: 'النوع',
          actions: 'الإجراءات',
          noAddresses: 'لا توجد عناوين في قائمة السماح.',
      }
    },
    sidebar: {
      dashboard: 'لوحة التحكم',
      settings: 'الإعدادات',
      logout: 'تسجيل الخروج',
      toggleTheme: 'تبديل السمة',
      toggleLanguage: 'تبديل اللغة',
      adminUser: {
        name: 'المسؤول',
        email: 'admin@lanstream.local',
      },
    },
    videoCard: {
      watchNow: 'شاهد الآن',
    },
    watch: {
        backToCatalog: 'العودة إلى الكتالوج'
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
        invalidAddress: {
            title: "عنوان غير صالح",
            description: "الرجاء إدخال عنوان IP أو MAC صالح.",
        },
        addressExists: {
            title: "العنوان موجود",
            description: "هذا العنوان موجود بالفعل في القائمة.",
        },
        addressAdded: {
            title: "تمت إضافة العنوان",
            description: "تمت إضافته إلى قائمة السماح.",
        },
        addressRemoved: {
            title: "تمت إزالة العنوان",
            description: "تمت إزالته.",
        }
    }
  },
};

export type Language = keyof typeof translations;
export type TranslationKey = keyof (typeof translations)['en'];
