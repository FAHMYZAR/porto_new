---
title: Tutorial Lengkap Firebase Auth di Flutter (Google & Email)
date: 2024-11-22T00:00:00.000Z
author: Nuriskha Ainun Fahmi
image: /assets/images/blog/tutorial-firebase-auth.jpg
image_url: 'https://images.unsplash.com/photo-1509822929063-6b6cfc9b42f2?w=800'
category: Tutorial
tags: 'Flutter, Firebase, Auth, Google Sign In'
excerpt: >-
  Panduan step-by-step mengintegrasikan login Google dan Email di aplikasi
  Flutter menggunakan Firebase Authentication.
---

# Tutorial Lengkap Firebase Auth di Flutter

Firebase Auth memudahkan kita mengelola user tanpa pusing memikirkan backend security.

## Persiapan

1. Buat project di Firebase Console.
2. Download `google-services.json` (Android) dan `GoogleService-Info.plist` (iOS)
3. Tambahkan dependency `firebase_auth` dan `google_sign_in`

## Implementasi Google Sign In

```dart
final GoogleSignInAccount? googleUser = await GoogleSignIn().signIn();
final GoogleSignInAuthentication? googleAuth = await googleUser?.authentication;
// Gunakan token untuk sign in ke Firebase
```

## Tips Keamanan

Pastikan SHA-1 fingerprint sudah ditambahkan di Firebase Console, atau login Google akan gagal!
