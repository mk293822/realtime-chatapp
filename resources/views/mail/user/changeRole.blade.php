<x-mail::message>
Hello {{$user->name}},

@if ($user->is_admin)
     You are admin user now!
@else
    Your are normal user now!
@endif

Thank You, <br>
{{config("app.name")}}

</x-mail::message>