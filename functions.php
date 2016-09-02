<?php

/**
 *
 * Stick this functioin in your functions.php file
 *
 */


$templateDirectory = get_template_directory_uri();
$themeCssUrl = $templateDirectory . '/assets/css'; 


// Conditinally enqueue styles based on body class
function enqueue_styles() {
    wp_enqueue_style( 'theme_local_foundation_css', $themeCssUrl . 'foundation.min.css', [], '0.1.0', 'all');
    wp_enqueue_style( 'theme_local_css', $themeCssUrl . 'main.css', [], '0.1.0', 'all');

    $page_template_names = get_body_class();

    foreach($page_template_names as $template) {
        if (is_readable($themeRelativeUrl . 'templates/' . $template . '.css')) {
            wp_enqueue_style($template . '_css', $themeCssUrl . 'templates/' . $template . '.css', [], '0.1.0', 'all');
        }
    }
}
add_action( 'wp_enqueue_scripts', 'enqueue_styles' );

?>
