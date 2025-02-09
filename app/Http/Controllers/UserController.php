<?php

namespace App\Http\Controllers;

use App\Mail\UserBlockUnblock;
use App\Mail\UserChangeRole;
use App\Mail\UserCreated;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use App\Models\User;
use Illuminate\Support\Facades\Mail;

class UserController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            "name" => "required|string",
            "email" => ["required", "email", "unique:users,email"],
            "is_admin" => "boolean"
        ]);

        $rawPassword = Str::random(8);
        // $rawPassword = 'passwords';
        $data['password'] = bcrypt($rawPassword);
        $data['email_verified_at'] = now();

        $user = User::create($data);

        Mail::to($user)->send(new UserCreated($user, $rawPassword));

        return redirect()->back();
    }


    public function changeRole(User $user)
    {
        $user->update(['is_admin' => !(bool) $user->is_admin]);

        $message = "User role was changed into " . ($user->is_admin ? '"Admin"' : '"Regular"') . "User";
        Mail::to($user)->send(new UserChangeRole($user));

        return response()->json(['message', $message]);
    }

    public function blockUnblock(User $user)
    {
        if ($user->is_admin)
            return response()->json(['message', "Admin Users Can't be Block!"]);

        if ($user->blocked_at) {
            $user->blocked_at = null;
            $message = "User " . $user->name . " Account has been activated";
        } else {
            $user->blocked_at = now();
            $message = "User " . $user->name . " account has been blocked!";
        }
        $user->save();

        Mail::to($user)->send(new UserBlockUnblock($user));

        return response()->json(['message', $message]);
    }
}