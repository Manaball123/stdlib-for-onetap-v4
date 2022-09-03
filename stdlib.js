

const und = undefined;


//UI WRAPPERS
const SLIDERINT =     0;
const SLIDERFLOAT =   1;
const DROPDOWN =      2;
const MULTIDROPDOWN = 3;
const CHECKBOX =      4;
const TEXTBOX =       5;
const COLORPICKER =   6;
const HOTKEY =        7;

function UIElement(path, name, type, val1, val2)
{

    this.path = path;
    this.name = name;
    this.fullpath = this.path.concat(this.name)
    this.type = type;
    this.val1 = val1;
    this.val2 = val2;

    this.Get = function()
    {
        return UI.GetValue(this.fullpath);
    }
    this.Set = function(n)
    {
        UI.SetValue(this.fullpath, n);
    }
    this.Hide = function()
    {
        UI.SetEnabled(this.fullpath, 0);
    }
    this.Show = function()
    {
        UI.SetEnabled(this.fullpath, 1);
    }
    this.Delete = function()
    {
        UI.RemoveItem(this.fullpath);
    }

    switch(this.type)
    {
        case SLIDERINT:
            UI.AddSliderInt(this.path, this.name, this.val1, this.val2);
            break;
        case SLIDERFLOAT:
            UI.AddSliderFloat(this.path, this.name, this.val1, this.val2);
            break;
        case DROPDOWN:
            if(this.val2 == undefined)
            {
                this.val2 = 0;
            }
            UI.AddDropdown(this.path, this.name, this.val1, this.val2);
            break;

        case MULTIDROPDOWN:
            
            UI.AddMultiDropdown(this.path, this.name, this.val1)
            this.GetAtIndex = function(i)
            {
                var mask = 1 << i;
                return UI.GetValue(this.fullpath) & mask ? true : false;
            }
            this.SetAtIndex = function(i)
            {
                UI.SetValue(this.fullpath, UI.GetValue(this.fullpath) | (1 << i));
            }
            break;
        case CHECKBOX:
            UI.AddCheckbox(this.path, this.name);
            break;

        case TEXTBOX:
            UI.AddTextbox(this.path, this.name);
            this.Get = function()
            {
                return UI.GetString(this.fullpath);
            }
            break;
            
        case COLORPICKER:

            UI.AddColorPicker(this.path, this.name);

            this.Get = function()
            {
                return UI.GetColor(this.fullpath);
            }
            this.Set = function(n)
            {
                UI.SetColor(this.fullpath, n);
            }
            break;
        case HOTKEY:
            UI.AddHotkey(this.path, this.name, this.val1);
            this.GetState = function()
            {
                return UI.GetHotkeyState(this.fullpath);
            }
            this.SetState = function(n)
            {
                UI.SetHotkeyState(this.fullpath, n);
            }

            this.Set = function(n)
            {
                this.Get() != n ? UI.ToggleHotkey(this.fullpath) : 0;
            }
            this.Toggle = function()
            {
                UI.ToggleHotkey(this.fullpath)
            }
            break;
    }


}









//Vectors and angles
function Vector(a, x, y, z)
{
    this.x = x;
    this.y = y;
    this.z = z;
    if(a != undefined)
    {
        this.x = a[0];
        this.z = a[1];
        this.y = a[2]; 
    }

    this.GetArr = function()
    {

        return [this.x,this.z,this.y];
    }
    this.Copy = function()
    {
        return new Vector(und, this.x, this.y, this.z);
    }
    this.Length = function()
    {
        return Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2);
    }
    this.AddFrom = function(v)
    {

        this.x += v.x;
        this.y += v.y;
        this.z += v.z;

    }
    this.SubFrom = function(v)
    {
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
    }
    this.Scale = function(n)
    {
        this.x = this.x * n;
        this.y = this.y * n;
        this.z = this.z * n;
    }
    this.GetScaled = function(n)
    {
        var v = this.Copy()
        v.Scale(n)
        return v
    }
    this.GetNormalized = function()
    {
        var length = this.Length();
        return new Vector(und, this.x / length, this.y / length, this.z / length);
    }
    this.Normalize = function()
    {
        var length = this.Length();
        this.x = this.x / length;
        this.y = this.y / length;
        this.z = this.z / length;
    }
    this.Add = function(v)
    {
        res = new Vector(und, this.x + v.x,this.y + v.y,this.z + v.z);
        return res;
    };
    this.Sub = function(v)
    {
        res = new Vector(
            und,
            this.x - v.x,
            this.y - v.y,
            this.z - v.z)
            return res;
    }

    this.Dot = function(v)
    {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }


}

function Angles(a, yaw, pitch, roll)
{

        this.yaw = yaw;
        this.pitch = pitch;
        this.roll = roll;
    
    if(a != undefined)
    {
        this.pitch = a[0];
        this.yaw = a[1];
        this.roll = a[2];

    }
        
    
    this.GetArr = function()
    {
       
        return [this.pitch,this.yaw,this.roll];
    }
    this.ToVec = function()
    {
        return new Vector(und, Math.cos(DEG2RAD(this.pitch)) * Math.cos(DEG2RAD(this.yaw)),  -Math.sin(DEG2RAD(this.pitch)), Math.cos(DEG2RAD(this.pitch)) * Math.sin(DEG2RAD(this.yaw)));
    }

/*
    returns a forward, right, and up vector from an angle
    dont ask me how its done
    fucking hell dude
*/
    this.ToVectors = function()
    {
        var sy, sp, sr, cy, cp, cr

        sy = Math.sin(this.yaw)
        sp = Math.sin(this.pitch)
        sr = Math.sin(this.roll)

        cy = Math.cos(this.yaw)
        cp = Math.cos(this.pitch)
        cr = Math.cos(this.roll)
    }
}

function ExtrapolatedTimeToPoint()
{
    
}

function GetDropdownValue(value, index)
{
    var mask = 1 << index;
    return value & mask ? true : false;
}

function ANGLE2VEC(angle) 
{
	var pitch = angle[0];
	var yaw = angle[1];
	return [Math.cos(DEG2RAD(pitch)) * Math.cos(DEG2RAD(yaw)), Math.cos(DEG2RAD(pitch)) * Math.sin(DEG2RAD(yaw)), -Math.sin(DEG2RAD(pitch))];
}
function DEG2RAD(degree)
{
    return degree * Math.PI / 180.0;
}
function MoveToPoint(point)
{

    localplayerPos = GetLocalOrigin();
    var vecToPeek = point.Sub(localplayerPos);
    vecToPeek.y = 0
	var angle = Math.atan2(vecToPeek.z, vecToPeek.x) * (180 / Math.PI);;
	var viewYaw = Local.GetViewAngles()[1] - 180;
	var realAngle = (AdjustAngle(angle - viewYaw) + 90) * (Math.PI / 180);
	var distance = vecToPeek.Length();
    UserCMD.SetMovement([Math.cos(realAngle) * (distance < 20 ? 50 + distance * 5 : 450), Math.sin(realAngle) * (distance < 20 ? 50 + distance * 5 : 450), 0]);
    return distance;
}
