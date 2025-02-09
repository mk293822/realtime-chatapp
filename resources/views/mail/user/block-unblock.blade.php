<x-mail::message>
Hello {{ $user->name }},

@if ($user->blocked_at)
    Your account has been suspended. You can no longer log in to this account.
@else
    Your account has been activated. You can use this account now!

    <x-mail::button :url="route('login')">
        Click Here to Login
    </x-mail::button>
@endif

Thank You,  
{{ config('app.name') }}

</x-mail::message>
