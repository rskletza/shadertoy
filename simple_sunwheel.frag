// color definition
vec3 darksky = vec3(0.0, 0.04, 0.46);
vec3 lightsky = vec3(0.6, 0.9, 1.0);
vec3 orangesun = vec3(1.0, 0.28, 0.0);
vec3 yellowsun = vec3(1.0, 1.0, 0.84);

// the path that the sun takes
vec2 sunposition()
{
    float x = mod(0.1 * iTime, 2.0);
    float y = -pow((2.3*(x-0.5)),3.8)+1.1;
    
    return vec2(x,y);
}

// distance from each fragment to the sun at a given time
float sundist(vec2 st)
{
    float w_h_ratio = iResolution.x/iResolution.y;
    if (w_h_ratio > 1.0)
    {
        st.x *= w_h_ratio;
    }
    else
    {
        st.y /= w_h_ratio;
    }
    return distance(st, sunposition());
}

// the intensity of the sun related to distance
float sunball(vec2 st)
{
    float x = sundist(st);
    float y = exp(-pow(10. * x,2.)) + 0.05;
    float g = exp(-pow(x,2.)) * 0.25;
    y += g;
    return y;
}

// the color of the sun/sky depending on the position of the sun in the sky
vec3 color_from_position(vec3 sunset_color, vec3 daytime_color)
{
    float factor = clamp(sunposition().y, 0.0, 1.0);
    return mix(sunset_color, daytime_color, factor); 
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // Normalized pixel coordinates (from 0 to 1)
    vec2 st = fragCoord/iResolution.xy;

    // create a reflection
    st -= vec2(0.0,0.2);
    st.y = abs(st.y);

    // calculate the color of the fragment depending on its distance to the sun and the "time of day"
    vec3 color = vec3(0.0, 0.0, 0.0);
    float sunfactor = sunball(st);
    vec3 sun_color = color_from_position(orangesun, yellowsun);
    vec3 sky_color = color_from_position(darksky, lightsky);
    color = mix(sky_color, sun_color, sunfactor);

    fragColor = vec4(color, 1.0);
}